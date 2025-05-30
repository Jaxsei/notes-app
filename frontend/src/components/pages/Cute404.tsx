import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, Search, ArrowLeft, AlertTriangle, Heart, Compass, Sparkles } from 'lucide-react';

// Framer Motion components (using CSS animations as fallback since framer-motion isn't available)
const MotionDiv = ({ children, className, initial, animate, transition, delay, whileHover, whileTap, ...props }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay || 0);
    return () => clearTimeout(timer);
  }, [delay]);

  const getAnimationClass = () => {
    if (!isVisible) {
      if (initial?.opacity === 0 && initial?.y) return 'opacity-0 translate-y-8';
      if (initial?.opacity === 0 && initial?.x) return 'opacity-0 translate-x-8';
      if (initial?.opacity === 0 && initial?.scale) return 'opacity-0 scale-95';
      return 'opacity-0';
    }
    return 'opacity-100 translate-y-0 translate-x-0 scale-100';
  };

  const duration = transition?.duration ? `duration-${Math.round(transition.duration * 1000)}` : 'duration-700';
  const ease = transition?.ease === 'easeOut' ? 'ease-out' : 'ease-in-out';

  return (
    <div
      className={`${className} transition-all ${duration} ${ease} ${getAnimationClass()} hover:scale-105 active:scale-95`}
      {...props}
    >
      {children}
    </div>
  );
};

export default function Cute404Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const quickActions = [
    { icon: Home, label: "Back to Home", variant: "default" },
    { icon: Search, label: "Search", variant: "outline" },
    { icon: ArrowLeft, label: "Go Back", variant: "ghost" }
  ];

  const suggestions = [
    {
      title: "Check the URL",
      description: "Make sure the web address is spelled correctly"
    },
    {
      title: "Go to homepage",
      description: "Start fresh from our main page"
    },
    {
      title: "Use search",
      description: "Find what you're looking for with our search function"
    },
    {
      title: "Contact support",
      description: "Let us know if you think this is an error"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '0s', animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-muted/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '4s', animationDuration: '12s' }} />
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: '2s', animationDuration: '6s' }} />

        {/* Floating particles */}
        {mounted && [...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-muted-foreground/30 rounded-full animate-bounce"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`
            }}
          />
        ))}
      </div>

      <MotionDiv
        className="max-w-2xl w-full space-y-8 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >

        {/* Header Section */}
        <MotionDiv
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          delay={200}
        >
          <div className="relative inline-block">
            <MotionDiv
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className="text-8xl font-bold text-muted-foreground/20 select-none hover:text-muted-foreground/40 transition-colors duration-500"
            >
              404
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, x: 20, rotate: 15 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute -top-2 -right-2"
            >
              <Badge
                variant="destructive"
                className="hover:scale-110 transition-transform duration-300 cursor-default shadow-lg"
              >
                <Sparkles className="w-3 h-3 mr-1 animate-spin" style={{ animationDuration: '4s' }} />
                Not Found
              </Badge>
            </MotionDiv>
          </div>

          <MotionDiv
            className="space-y-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight hover:tracking-wide transition-all duration-500">
              Page not found
            </h1>
            <p className="text-xl text-muted-foreground hover:text-foreground transition-colors duration-300">
              Sorry, we couldn't find the page you're looking for.
            </p>
          </MotionDiv>
        </MotionDiv>

        {/* Alert */}
        <MotionDiv
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          <Alert className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-destructive/50">
            <AlertTriangle className="h-4 w-4 animate-pulse" />
            <AlertDescription>
              The page you requested could not be found. This might be because the URL is incorrect,
              the page has been moved, or it no longer exists.
            </AlertDescription>
          </Alert>
        </MotionDiv>

        {/* Main Card */}
        <MotionDiv
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Card className="hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
            <CardHeader>
              <MotionDiv
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <CardTitle className="flex items-center gap-2">
                  <Compass className="h-5 w-5 animate-spin" style={{ animationDuration: '8s' }} />
                  What can you do?
                </CardTitle>
                <CardDescription>
                  Here are some helpful suggestions to get you back on track.
                </CardDescription>
              </MotionDiv>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Suggestions */}
              <div className="grid gap-3">
                {suggestions.map((suggestion, index) => (
                  <MotionDiv
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                    className="group"
                  >
                    <div className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-all duration-300 hover:shadow-md cursor-pointer hover:translate-x-2">
                      <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0 group-hover:animate-pulse"></div>
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors duration-300">{suggestion.title}</p>
                        <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                      </div>
                    </div>
                  </MotionDiv>
                ))}
              </div>

              {/* Action Buttons */}
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.8 }}
                className="flex flex-col sm:flex-row gap-3 pt-4 border-t"
              >
                {quickActions.map((action, index) => (
                  <MotionDiv
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 2 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={action.variant}
                      className="flex items-center gap-2 transition-all duration-300 hover:shadow-lg"
                      size="lg"
                    >
                      <action.icon className="h-4 w-4 transition-transform duration-300 group-hover:rotate-3" />
                      {action.label}
                    </Button>
                  </MotionDiv>
                ))}
              </MotionDiv>
            </CardContent>
          </Card>
        </MotionDiv>

        {/* Error Code Details */}
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.2 }}
        >
          <Card className="bg-muted/30 hover:bg-muted/50 transition-all duration-500 hover:shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                    HTTP 404
                  </Badge>
                  <span className="text-muted-foreground">Resource not found</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span>Made with</span>
                  <Heart className="h-3 w-3 fill-current text-destructive animate-pulse" />
                  <span>by your Jaxsei</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </MotionDiv>

        {/* Status indicator */}
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
            <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
            All other systems operational
          </div>
        </MotionDiv>
      </MotionDiv>
    </div>
  );
}
