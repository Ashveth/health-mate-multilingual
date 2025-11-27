import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  Database, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  ArrowLeft,
  Globe,
  FileText,
  Brain
} from "lucide-react";
import { HealthHeader } from "@/components/HealthHeader";

export default function MedicalDisclaimer() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-bg">
      <HealthHeader />
      
      <main className="p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {/* Header */}
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full"
              >
                <Shield className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-4xl font-bold font-poppins text-primary">
                Medical Disclaimer
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Understanding how AI HealthMate provides health information and the importance of professional medical advice
              </p>
            </div>

            {/* Important Notice */}
            <Card className="border-yellow-500/50 bg-yellow-500/5">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Important Notice</h3>
                    <p className="text-sm text-muted-foreground">
                      AI HealthMate is an educational health information platform powered by artificial intelligence. 
                      It is <strong>NOT a substitute for professional medical advice, diagnosis, or treatment</strong>. 
                      Always seek the advice of your physician or other qualified health provider with any questions 
                      you may have regarding a medical condition.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  Our Data Sources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  AI HealthMate draws information from verified, authoritative medical sources to provide 
                  accurate and reliable health information:
                </p>

                <div className="grid gap-4">
                  {/* WHO */}
                  <div className="flex gap-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">World Health Organization (WHO)</h4>
                        <a 
                          href="https://www.who.int" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1 text-sm"
                        >
                          Visit <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Global health authority providing evidence-based guidelines, disease information, 
                        and public health recommendations. Primary source for international health standards.
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="px-2 py-1 bg-primary/10 rounded">Disease Guidelines</span>
                        <span className="px-2 py-1 bg-primary/10 rounded">Health Statistics</span>
                        <span className="px-2 py-1 bg-primary/10 rounded">Outbreak Data</span>
                      </div>
                    </div>
                  </div>

                  {/* CDC */}
                  <div className="flex gap-3 p-4 bg-accent/5 rounded-lg border border-accent/10">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Centers for Disease Control (CDC)</h4>
                        <a 
                          href="https://www.cdc.gov" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-accent hover:underline flex items-center gap-1 text-sm"
                        >
                          Visit <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Leading US health protection agency providing disease prevention and control information, 
                        vaccination guidelines, and health recommendations.
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="px-2 py-1 bg-accent/10 rounded">Prevention Guidelines</span>
                        <span className="px-2 py-1 bg-accent/10 rounded">Vaccination Info</span>
                      </div>
                    </div>
                  </div>

                  {/* Medical Research */}
                  <div className="flex gap-3 p-4 bg-secondary/5 rounded-lg border border-secondary/10">
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div className="space-y-2 flex-1">
                      <h4 className="font-semibold">Peer-Reviewed Medical Literature</h4>
                      <p className="text-sm text-muted-foreground">
                        Information from reputable medical journals and research publications including PubMed, 
                        The Lancet, and New England Journal of Medicine.
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="px-2 py-1 bg-secondary/10 rounded">Research Papers</span>
                        <span className="px-2 py-1 bg-secondary/10 rounded">Clinical Studies</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verification Process */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Our Verification Process
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  We follow a rigorous process to ensure information accuracy:
                </p>

                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Source Verification</h4>
                      <p className="text-sm text-muted-foreground">
                        All health information is cross-referenced with official WHO guidelines and 
                        recommendations from recognized health authorities.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">AI Processing</h4>
                      <p className="text-sm text-muted-foreground">
                        Advanced AI models analyze and synthesize information from trusted sources, 
                        ensuring responses are relevant and evidence-based.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Citation Transparency</h4>
                      <p className="text-sm text-muted-foreground">
                        Responses include citations to original sources when applicable, allowing you 
                        to verify information independently.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Regular Updates</h4>
                      <p className="text-sm text-muted-foreground">
                        Our knowledge base is continuously updated to reflect the latest medical 
                        guidelines and health recommendations.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Limitations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Understanding AI Limitations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  While AI HealthMate strives for accuracy, it&apos;s important to understand its limitations:
                </p>

                <div className="space-y-3">
                  <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                    <h4 className="font-semibold mb-2 text-red-700 dark:text-red-400">
                      ❌ AI Cannot:
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="text-red-500">•</span>
                        Provide medical diagnosis or treatment plans
                      </li>
                      <li className="flex gap-2">
                        <span className="text-red-500">•</span>
                        Replace consultations with healthcare professionals
                      </li>
                      <li className="flex gap-2">
                        <span className="text-red-500">•</span>
                        Prescribe medications or recommend dosages
                      </li>
                      <li className="flex gap-2">
                        <span className="text-red-500">•</span>
                        Handle medical emergencies (call emergency services immediately)
                      </li>
                      <li className="flex gap-2">
                        <span className="text-red-500">•</span>
                        Consider your complete medical history and personal circumstances
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                    <h4 className="font-semibold mb-2 text-green-700 dark:text-green-400">
                      ✅ AI Can Help With:
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="text-green-500">•</span>
                        General health education and information
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-500">•</span>
                        Understanding common symptoms and conditions
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-500">•</span>
                        Learning about disease prevention and wellness
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-500">•</span>
                        Finding healthcare resources and doctors
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-500">•</span>
                        Answering questions about health topics
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* When to Seek Medical Help */}
            <Card className="border-red-500/50 bg-red-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  When to Seek Immediate Medical Help
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm font-semibold">
                  Call emergency services (108 in India, 911 in US) immediately if you experience:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-red-500">🚨</span>
                    Chest pain or difficulty breathing
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500">🚨</span>
                    Sudden severe headache or confusion
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500">🚨</span>
                    Loss of consciousness or severe dizziness
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500">🚨</span>
                    Heavy bleeding or severe injuries
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500">🚨</span>
                    Sudden weakness, numbness, or vision problems
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500">🚨</span>
                    Severe allergic reactions or difficulty swallowing
                  </li>
                </ul>
                <p className="text-sm font-medium pt-2">
                  For non-emergency concerns, consult your doctor or visit the nearest healthcare facility.
                </p>
              </CardContent>
            </Card>

            {/* Terms of Use */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Terms of Use
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  By using AI HealthMate, you acknowledge and agree that:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      You understand this service provides general health information only
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      You will not use this service for medical emergencies or as a substitute for professional medical advice
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      You will always consult with qualified healthcare professionals for medical decisions
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      The service is provided &quot;as is&quot; without warranties of any kind
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>
                      We are not liable for any decisions made based on information provided by this service
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Questions or Concerns?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  If you have questions about our data sources, verification process, or how to use AI HealthMate safely:
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" asChild>
                    <a href="mailto:support@healthmate.com">
                      Contact Support
                    </a>
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/settings')}>
                    View Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Last Updated */}
            <div className="text-center text-sm text-muted-foreground pt-4 pb-8">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </div>
          </motion.div>
        </main>
    </div>
  );
}
