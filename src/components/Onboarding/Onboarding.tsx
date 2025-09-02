import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, CheckCircle, ArrowRight, Sparkles, Cloud, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

interface OnboardingProps {
  onComplete: (geminiKey: string) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [geminiKey, setGeminiKey] = useState('');
  const [step, setStep] = useState(1);
  const [keyValidated, setKeyValidated] = useState(false);

  const handleKeySubmit = () => {
    if (geminiKey.trim()) {
      setKeyValidated(true);
      setTimeout(() => {
        onComplete(geminiKey);
      }, 1000);
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-lg"
      >
        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto mb-4"
            >
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </motion.div>
            <CardTitle className="text-2xl">Welcome to Companion AI</CardTitle>
            <CardDescription>Let's get you set up in just a moment</CardDescription>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <motion.div 
                      className="flex gap-3 p-3 rounded-lg bg-muted/50"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">AI-Powered Conversations</p>
                        <p className="text-xs text-muted-foreground">
                          Chat with Google's Gemini AI for intelligent responses
                        </p>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="flex gap-3 p-3 rounded-lg bg-muted/50"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                        <Cloud className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Real-Time Weather</p>
                        <p className="text-xs text-muted-foreground">
                          Get weather updates and personalized suggestions
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={() => setStep(2)}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="text-center space-y-2">
                      <h3 className="font-semibold">Setup Gemini AI</h3>
                      <p className="text-sm text-muted-foreground">
                        Enter your Gemini API key to enable AI conversations
                      </p>
                    </div>

                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Enter your Gemini API key"
                        value={geminiKey}
                        onChange={(e) => setGeminiKey(e.target.value)}
                        className="pl-10 pr-10"
                      />
                      {keyValidated && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </motion.div>
                      )}
                    </div>

                    <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                      <p className="text-xs text-muted-foreground">
                        Don't have a key? Get one free at:
                      </p>
                      <a 
                        href="https://makersuite.google.com/app/apikey" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        makersuite.google.com
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      variant="outline"
                      className="flex-1"
                      onClick={() => onComplete('')}
                    >
                      Skip for now
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={handleKeySubmit}
                      disabled={!geminiKey.trim()}
                    >
                      {keyValidated ? 'Starting...' : 'Continue'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-6">
              {[1, 2].map((i) => (
                <motion.div
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    step === i ? "w-8 bg-primary" : "w-1.5 bg-muted"
                  )}
                  animate={{
                    scale: step === i ? 1 : 0.8,
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Onboarding;