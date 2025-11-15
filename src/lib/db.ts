import { supabase } from './supabase';
import { Configuration, Submission, WebhookLog } from './types';

// ============ CONFIGURATION OPERATIONS ============

export async function saveConfiguration(
  userId: string,
  data: {
    prompt: string;
    topic: string;
    image?: string;
    scheduled_time?: string;
    repeat_frequency?: string;
  }
) {
  try {
    const { data: config, error } = await supabase
      .from('configurations')
      .insert([
        {
          user_id: userId,
          ...data,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { data: config, error: null };
  } catch (error) {
    console.error('Error saving configuration:', error);
    return { data: null, error };
  }
}

export async function updateConfiguration(
  configId: string,
  data: Partial<Omit<Configuration, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
) {
  try {
    const { data: config, error } = await supabase
      .from('configurations')
      .update(data)
      .eq('id', configId)
      .select()
      .single();

    if (error) throw error;
    return { data: config, error: null };
  } catch (error) {
    console.error('Error updating configuration:', error);
    return { data: null, error };
  }
}

export async function getLatestConfiguration(userId: string) {
  try {
    const { data: config, error } = await supabase
      .from('configurations')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return { data: config || null, error: null };
  } catch (error) {
    console.error('Error fetching configuration:', error);
    return { data: null, error };
  }
}

export async function getAllConfigurations(userId: string) {
  try {
    const { data: configs, error } = await supabase
      .from('configurations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: configs || [], error: null };
  } catch (error) {
    console.error('Error fetching configurations:', error);
    return { data: [], error };
  }
}

export async function deleteConfiguration(configId: string) {
  try {
    const { error } = await supabase
      .from('configurations')
      .delete()
      .eq('id', configId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting configuration:', error);
    return { error };
  }
}

// ============ SUBMISSION OPERATIONS ============

export async function createSubmission(
  userId: string,
  configId: string,
  data: {
    prompt: string;
    topic: string;
    image?: string;
  }
) {
  try {
    const { data: submission, error } = await supabase
      .from('submissions')
      .insert([
        {
          user_id: userId,
          configuration_id: configId,
          ...data,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { data: submission, error: null };
  } catch (error) {
    console.error('Error creating submission:', error);
    return { data: null, error };
  }
}

export async function updateSubmissionStatus(
  submissionId: string,
  status: 'pending' | 'success' | 'failed',
  webhookResponse?: Record<string, any>
) {
  try {
    const { data: submission, error } = await supabase
      .from('submissions')
      .update({
        status,
        webhook_response: webhookResponse,
      })
      .eq('id', submissionId)
      .select()
      .single();

    if (error) throw error;
    return { data: submission, error: null };
  } catch (error) {
    console.error('Error updating submission status:', error);
    return { data: null, error };
  }
}

export async function getSubmissionHistory(userId: string, limit = 10) {
  try {
    const { data: submissions, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data: submissions || [], error: null };
  } catch (error) {
    console.error('Error fetching submission history:', error);
    return { data: [], error };
  }
}

// ============ WEBHOOK LOG OPERATIONS ============

export async function logWebhookCall(
  userId: string,
  submissionId: string,
  payload: Record<string, any>,
  responseStatus: number,
  responseBody?: Record<string, any>
) {
  try {
    const { error } = await supabase
      .from('webhook_logs')
      .insert([
        {
          user_id: userId,
          submission_id: submissionId,
          payload,
          response_status: responseStatus,
          response_body: responseBody,
        },
      ]);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error logging webhook call:', error);
    return { error };
  }
}

export async function getWebhookLogs(userId: string, limit = 20) {
  try {
    const { data: logs, error } = await supabase
      .from('webhook_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data: logs || [], error: null };
  } catch (error) {
    console.error('Error fetching webhook logs:', error);
    return { data: [], error };
  }
}

// ============ STORAGE OPERATIONS (for images) ============

export async function uploadImage(userId: string, file: File): Promise<{ url: string | null; error: any }> {
  try {
    const fileName = `${userId}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('post-images')
      .upload(fileName, file, {
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('post-images')
      .getPublicUrl(fileName);

    return { url: urlData.publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { url: null, error };
  }
}

export async function deleteImage(userId: string, fileName: string) {
  try {
    const { error } = await supabase.storage
      .from('post-images')
      .remove([`${userId}/${fileName}`]);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting image:', error);
    return { error };
  }
}
