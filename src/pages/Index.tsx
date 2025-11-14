import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Edit2, Send, Save, Play, Pause, Upload, X, Eye, ThumbsUp, MessageCircle, Share2, Send as SendIcon, Calendar, LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import promptAudio from "@/assets/prompt-templates-audio.mp3";
import configAudio from "@/assets/configuration-audio.mp3";

const timeSlots = ["7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM"];
const repeatOptions = [
  { label: "This Week", value: "week" },
  { label: "2 Days", value: "2days" },
  { label: "3 Days", value: "3days" },
  { label: "4 Days", value: "4days" },
  { label: "5 Days", value: "5days" },
  { label: "Daily", value: "daily" },
];
interface SavedData {
  prompt: string;
  topic: string;
  image?: string;
}
const Index = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);
  const [prompt, setPrompt] = useState("");
  const [topic, setTopic] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [isEditing, setIsEditing] = useState(true);
  const [savedData, setSavedData] = useState<SavedData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isConfigPlaying, setIsConfigPlaying] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [lastSubmittedData, setLastSubmittedData] = useState<SavedData | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedRepeat, setSelectedRepeat] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const configAudioRef = useRef<HTMLAudioElement>(null);
  const {
    toast
  } = useToast();
  const WEBHOOK_URL = "https://n8n.gignaati.com/webhook-test/07e74f76-8ca8-4b43-87f9-0d95a0ee8bae";
  useEffect(() => {
    // Load saved data from localStorage
    const stored = localStorage.getItem("webhookData");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setSavedData(data);
        setPrompt(data.prompt);
        setTopic(data.topic);
        setUploadedImage(data.image || "");
        setIsEditing(false);
      } catch (e) {
        console.error("Error parsing saved data:", e);
      }
    }
  }, []);
  const handleSave = () => {
    if (!prompt.trim() || !topic.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both fields",
        variant: "destructive"
      });
      return;
    }
    const data = {
      prompt,
      topic,
      image: uploadedImage
    };
    localStorage.setItem("webhookData", JSON.stringify(data));
    setSavedData(data);
    setIsEditing(false);
    toast({
      title: "Saved Successfully",
      description: "Your prompt and topic have been saved"
    });
  };
  const handleSubmit = async () => {
    if (!savedData && (!prompt.trim() || !topic.trim())) {
      toast({
        title: "Error",
        description: "Please save your prompt and topic first",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const dataToSend = savedData || {
        prompt,
        topic
      };
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: dataToSend.prompt,
          topic: dataToSend.topic,
          image: dataToSend.image,
          timestamp: new Date().toISOString()
        })
      });
      if (response.ok) {
        setLastSubmittedData(dataToSend);
        toast({
          title: "Success",
          description: "Data sent to webhook successfully"
        });
      } else {
        throw new Error("Failed to send data");
      }
    } catch (error) {
      console.error("Error sending to webhook:", error);
      toast({
        title: "Error",
        description: "Failed to send data to webhook. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive"
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage("");
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleConfigAudio = () => {
    if (configAudioRef.current) {
      if (isConfigPlaying) {
        configAudioRef.current.pause();
      } else {
        configAudioRef.current.play();
      }
      setIsConfigPlaying(!isConfigPlaying);
    }
  };
  const templates = [
    {
      name: "Gignaati",
      text: `[You are Gignaati - an innovative AI education and digital worker marketplace platform that empowers Indian professionals and students to build, deploy, and monetize AI agents without coding.

Write a LinkedIn post (150–200 words) on the topic: [INSERT TOPIC HERE]

**Brand Voice Guidelines:**
- Inspiring and community-focused tone
- Balance technical expertise with accessibility
- Emphasize democratization of AI for Bharat
- Use strategic emojis (2-4 maximum)
- Include trending hashtags relevant to the topic

**Post Structure:**
1. **Hook:** Compelling opening about [TOPIC] and its impact on India/AI education
2. **Problem/Context:** Highlight the challenge or gap in the current landscape
3. **Gignaati's Solution:** Connect the topic to our offerings:
   - AI Academy with 24-hour agent-building courses
   - 1,000+ AI agents marketplace
   - No-code deployment with N8N, LangChain, GPT
   - "Become a CoPilot in 7 Days" program
4. **Social Proof:** Naturally weave in relevant metrics:
   - 100,000+ learners onboarded
   - 900+ college partnerships
   - 1.4M+ YouTube subscribers
   - $1M+ in marketplace deals
5. **Call-to-Action:** Encourage engagement (comment, visit, learn more)

**Core Mission to Reflect:**
"Empowering Bharat to build, deploy, and earn with AI"

**Mandatory Hashtags:** #AIForBharat #Gignaati #AIEducation  
**Add 3-5 topic-specific trending hashtags**

**Tone Examples:**
✅ "Imagine a India where every student can build their first AI agent in 24 hours"
✅ "The future of work isn't about competing with AI—it's about commanding it"
❌ Avoid corporate jargon or overly salesy language]`
    },
    {
      name: "Swaransoft",
      text: `[You are Swaransoft - a global digital transformation company with 20+ years of expertise, serving 1,500+ clients across APAC, EMEA, and USA with enterprise-grade technology solutions.

Write a LinkedIn post (150–200 words) on the topic: [INSERT TOPIC HERE]

**Brand Voice Guidelines:**
- Professional, authoritative, and results-driven
- Emphasize enterprise expertise and proven track record
- Showcase technical depth and business impact
- Strategic emoji use (1-3 maximum for enterprise audience)
- Industry-specific hashtags

**Post Structure:**
1. **Hook:** Industry insight or trend related to [TOPIC]
2. **Challenge:** Business problem or transformation need in the enterprise context
3. **Swaransoft's Approach:** Connect to relevant services:
   - Digital Transformation & Consulting
   - Custom Software & Mobile Development
   - Low-Code Development (OutSystems certified)
   - AI/GenAI Solutions (Azure OpenAI specialization)
   - Business Intelligence & Data Analytics
   - IoT Solutions & Smart Platforms
   - Cloud Consulting (AWS, Azure, GCP)
   - RPA & Process Automation
4. **Proof Points:** Include relevant achievements:
   - 1,500+ global clients served
   - 1,200+ projects implemented
   - ₹800 Crore e-governance project
   - Partnerships: Microsoft, Salesforce, AWS, OutSystems
   - ISO 9001 & CMMi certified
   - Key clients: DMRC, Indian Railways, Konica Minolta
5. **Call-to-Action:** Invite consultation, discussion, or partnership inquiry

**Company Philosophy:**
"Where SMART people do GREAT projects"

**Mandatory Hashtags:** #DigitalTransformation #Swaransoft #EnterpriseIT  
**Add 3-5 topic-specific industry hashtags**

**Tone Examples:**
✅ "In today's enterprise landscape, digital transformation isn't optional—it's survival"
✅ "Twenty years of engineering excellence, one mission: turning complexity into competitive advantage"
❌ Avoid overly casual language or consumer-focused messaging]`
    }
  ];

  const handleInsertTemplate = (templateText: string) => {
    setPrompt(templateText);
    setIsEditing(true);
    toast({
      title: "Template Inserted",
      description: "You can now edit and save your configuration"
    });
  };

  if (!user) return null;

  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Modern Hero Section */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 border-b border-primary/20 shadow-sf-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex justify-between items-center mb-8">
            <div className="text-left animate-fade-in">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Welcome back, {user?.username || 'User'}
              </h1>
              <p className="text-lg text-white/80">
                Manage your LinkedIn content creation workflow
              </p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-sf-md hover:shadow-sf-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
                    <p className="text-3xl font-bold text-primary mt-1">24</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <SendIcon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-sf-md hover:shadow-sf-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Engagement</p>
                    <p className="text-3xl font-bold text-primary mt-1">1.2K</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <ThumbsUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-sf-md hover:shadow-sf-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                    <p className="text-3xl font-bold text-primary mt-1">5</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-sf-md hover:shadow-sf-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Reach</p>
                    <p className="text-3xl font-bold text-primary mt-1">5.8K</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Share2 className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => {
                setIsEditing(true);
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
              }}
              className="bg-white text-primary hover:bg-white/90 font-semibold shadow-sf-md hover:shadow-sf-lg transition-all duration-300"
            >
              <Edit2 className="mr-2 h-5 w-5" />
              Create New Post
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowPreview(true)}
              disabled={!lastSubmittedData}
              className="bg-white/10 text-white border-white/30 hover:bg-white/20 font-semibold backdrop-blur-sm"
            >
              <Eye className="mr-2 h-5 w-5" />
              Preview Last Post
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/report')}
              className="bg-white/10 text-white border-white/30 hover:bg-white/20 font-semibold backdrop-blur-sm"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              View Reports
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Prompt Templates Section */}
        <section className="mb-12 animate-slide-up">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Prompt Templates</h2>
              <p className="text-muted-foreground">Choose from professionally crafted templates</p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleAudio}
              aria-label={isPlaying ? "Pause audio" : "Play audio"}
              className="hover-glow transition-all"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <audio
              ref={audioRef}
              src={promptAudio}
              onEnded={() => setIsPlaying(false)}
              onPause={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {templates.map((template, index) => (
              <Card 
                key={template.name} 
                className="hover-lift border-border/50 shadow-md hover:shadow-xl transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-bold mb-2">{template.name}</CardTitle>
                      <CardDescription className="text-sm">
                        Professional template ready to customize
                      </CardDescription>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold text-lg">{template.name[0]}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gradient-to-br from-secondary/50 to-secondary/30 p-4 rounded-lg border border-border/30 max-h-48 overflow-y-auto">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed line-clamp-6">
                      {template.text}
                    </p>
                  </div>
                  <Button 
                    onClick={() => handleInsertTemplate(template.text)} 
                    className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300"
                    size="lg"
                  >
                    Insert Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Configuration Section */}
        <section className="animate-slide-up" style={{ animationDelay: "200ms" }}>
          <Card className="shadow-xl border-border/50 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Save className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-2xl font-bold">Configuration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleConfigAudio}
                      aria-label={isConfigPlaying ? "Pause audio" : "Play audio"}
                      className="hover-glow transition-all"
                    >
                      {isConfigPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    {!isEditing && savedData && (
                      <Button 
                        variant="outline" 
                        onClick={handleEdit} 
                        className="gap-2 hover:bg-primary/10 transition-all"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </Button>
                    )}
                  </div>
                </CardTitle>
                <audio
                  ref={configAudioRef}
                  src={configAudio}
                  onEnded={() => setIsConfigPlaying(false)}
                  onPause={() => setIsConfigPlaying(false)}
                  onPlay={() => setIsConfigPlaying(true)}
                />
                <CardDescription className="text-base">
                  {isEditing 
                    ? "Configure your content generation settings below" 
                    : "Your configuration is active and ready to deploy"}
                </CardDescription>
              </CardHeader>
            </div>

            <CardContent className="p-6 md:p-8 space-y-6">
              {isEditing ? (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="topic" className="text-base font-semibold flex items-center gap-2">
                      Today's Topic
                      <span className="text-xs text-muted-foreground font-normal">(Required)</span>
                    </Label>
                    <Input 
                      id="topic" 
                      placeholder="e.g., AI in Education, Digital Transformation..." 
                      value={topic} 
                      onChange={e => setTopic(e.target.value)} 
                      className="h-12 text-base border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="prompt" className="text-base font-semibold flex items-center gap-2">
                      Your Prompt Template
                      <span className="text-xs text-muted-foreground font-normal">(Required)</span>
                    </Label>
                    <Textarea 
                      id="prompt" 
                      placeholder="Enter your detailed prompt template here..." 
                      value={prompt} 
                      onChange={e => setPrompt(e.target.value)} 
                      className="min-h-[160px] text-base border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-none leading-relaxed"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="image" className="text-base font-semibold flex items-center gap-2">
                      Upload Image
                      <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                    </Label>
                    {!uploadedImage ? (
                      <div className="relative">
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Label 
                          htmlFor="image"
                          className="flex items-center justify-center gap-2 h-24 border-2 border-dashed border-border/50 rounded-md cursor-pointer hover:border-primary/50 hover:bg-accent/5 transition-all"
                        >
                          <Upload className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Click to upload image (Max 5MB)</span>
                        </Label>
                      </div>
                    ) : (
                      <div className="relative">
                        <img 
                          src={uploadedImage} 
                          alt="Uploaded preview" 
                          className="w-full h-48 object-cover rounded-md border border-border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={removeImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-2">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Schedule Configuration
                      <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                    </Label>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm">Select Time (IST)</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {timeSlots.map((time) => (
                            <Button
                              key={time}
                              type="button"
                              variant={selectedTime === time ? "default" : "outline"}
                              onClick={() => setSelectedTime(time)}
                              className="w-full text-sm h-9"
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Repeat Frequency</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {repeatOptions.map((option) => (
                            <Button
                              key={option.value}
                              type="button"
                              variant={selectedRepeat === option.value ? "default" : "outline"}
                              onClick={() => setSelectedRepeat(option.value)}
                              className="w-full text-sm h-9"
                            >
                              {option.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {selectedTime && selectedRepeat && (
                      <div className="p-3 bg-muted/30 rounded-lg border border-border/30">
                        <p className="text-sm text-center">
                          Scheduled for <span className="font-semibold">{selectedTime}</span> repeating{" "}
                          <span className="font-semibold">{repeatOptions.find(o => o.value === selectedRepeat)?.label}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleSave}
                    className="w-full gap-2 h-12 text-base bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300" 
                    size="lg"
                  >
                    <Save className="h-5 w-5" />
                    Save Configuration
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-5 p-6 bg-gradient-to-br from-secondary/50 to-secondary/30 rounded-xl border border-border/30">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Topic</Label>
                      <p className="text-lg font-medium text-foreground leading-relaxed">{savedData?.topic}</p>
                    </div>
                    <div className="h-px bg-border/30"></div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Prompt Template</Label>
                      <p className="text-base text-foreground whitespace-pre-wrap leading-relaxed">{savedData?.prompt}</p>
                    </div>
                    {savedData?.image && (
                      <>
                        <div className="h-px bg-border/30"></div>
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Uploaded Image</Label>
                          <img 
                            src={savedData.image} 
                            alt="Saved image" 
                            className="w-full h-48 object-cover rounded-md border border-border"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Button 
                      onClick={handleSubmit} 
                      disabled={isSubmitting} 
                      className="w-full gap-2 h-12 text-base bg-gradient-to-r from-accent to-accent/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" 
                      size="lg"
                    >
                      <Send className="h-5 w-5" />
                      {isSubmitting ? "Sending..." : "Deploy to Webhook"}
                    </Button>

                    {lastSubmittedData && (
                      <Button 
                        onClick={() => setShowPreview(true)} 
                        variant="outline"
                        className="w-full gap-2 h-12 text-base hover:bg-primary/5 border-primary/20 hover:border-primary/40 transition-all duration-300" 
                        size="lg"
                      >
                        <Eye className="h-5 w-5" />
                        Preview LinkedIn Post
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* LinkedIn Preview Dialog */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>LinkedIn Post Preview</DialogTitle>
            </DialogHeader>
            
            {/* LinkedIn-style post card */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              {/* Post header */}
              <div className="p-4 flex items-start gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-semibold text-primary">AI</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">Your Company Name</p>
                  <p className="text-sm text-muted-foreground">Company tagline or followers count</p>
                  <p className="text-xs text-muted-foreground">Just now • 🌐</p>
                </div>
              </div>

              {/* Post content */}
              <div className="px-4 pb-3">
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {lastSubmittedData?.topic}
                </p>
              </div>

              {/* Post image if exists */}
              {lastSubmittedData?.image && (
                <div className="w-full">
                  <img 
                    src={lastSubmittedData.image} 
                    alt="Post content" 
                    className="w-full object-cover max-h-96"
                  />
                </div>
              )}

              {/* Engagement stats */}
              <div className="px-4 py-3 border-t border-border">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>👍 128 • 💡 24</span>
                  <span>15 comments</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="px-4 py-2 border-t border-border flex items-center justify-around">
                <button className="flex items-center gap-2 px-4 py-2 rounded hover:bg-muted/50 transition-colors">
                  <ThumbsUp className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Like</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded hover:bg-muted/50 transition-colors">
                  <MessageCircle className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Comment</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded hover:bg-muted/50 transition-colors">
                  <Share2 className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Share</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded hover:bg-muted/50 transition-colors">
                  <SendIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Send</span>
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>;
};
export default Index;