"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, CreditCard, Shield, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface Course {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  features: string[];
}

interface PaymentModalProps {
  course: Course | null;
  onClose: () => void;
  onEnrollmentSuccess?: (courseId: number) => void;
}

export function PaymentModal({ course, onClose, onEnrollmentSuccess }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState({
    email: '',
    phone: '',
    name: ''
  });

  const handlePayment = async () => {
    if (!paymentData.email || !paymentData.phone || !paymentData.name) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with actual Razorpay integration
      // const options = {
      //   key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      //   amount: course!.price * 100, // Amount in paise
      //   currency: 'INR',
      //   name: 'TheLastTrade',
      //   description: course!.title,
      //   image: '/logo.png',
      //   handler: function (response: any) {
      //     toast.success('Payment successful! Welcome to the course!');
      //     console.log('Payment ID:', response.razorpay_payment_id);
      //     onClose();
      //   },
      //   prefill: {
      //     name: paymentData.name,
      //     email: paymentData.email,
      //     contact: paymentData.phone
      //   },
      //   theme: {
      //     color: '#22c55e'
      //   }
      // };

      // In a real app, you would load Razorpay script and create payment
      // For demo purposes, we'll simulate payment success and then enroll the user
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Authentication is now handled server-side via middleware
      // No need to check localStorage
      
      // Enroll the user in the course
      const enrollmentResponse = await fetch('/api/user/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course!.id
        })
      });

      if (enrollmentResponse.ok) {
        const enrollmentData = await enrollmentResponse.json();
        toast.success(`Payment successful! You're now enrolled in ${course!.title}!`);
        
        // Call the success callback if provided
        if (onEnrollmentSuccess) {
          onEnrollmentSuccess(course!.id);
        }
        
        onClose();
      } else {
        const errorData = await enrollmentResponse.json();
        toast.error(`Enrollment failed: ${errorData.error}`);
      }

    } catch (error) {
      toast.error('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  if (!course) return null;

  const discount = course.originalPrice - course.price;
  const discountPercentage = Math.round((discount / course.originalPrice) * 100);

  return (
    <Dialog open={!!course} onOpenChange={onClose}>
      <DialogContent className="glass border-white/20 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Complete Your Purchase
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            You're about to enroll in {course.title}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Course Summary */}
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">{course.title}</CardTitle>
              <CardDescription className="text-gray-300">
                Course Summary
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {course.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Separator className="bg-white/10" />

              <div className="space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>Original Price:</span>
                  <span className="line-through">₹{course.originalPrice}</span>
                </div>
                <div className="flex justify-between text-green-400">
                  <span>Discount ({discountPercentage}% OFF):</span>
                  <span>-₹{discount}</span>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex justify-between text-white font-bold text-lg">
                  <span>Total:</span>
                  <span>₹{course.price}</span>
                </div>
              </div>

              <Badge className="w-full justify-center bg-green-500/20 text-green-400 hover:bg-green-500/30">
                <Zap className="h-4 w-4 mr-1" />
                Limited Time Offer
              </Badge>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Details
              </CardTitle>
              <CardDescription className="text-gray-300">
                Enter your details to proceed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                  value={paymentData.name}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                  value={paymentData.email}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                  value={paymentData.phone}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-400 bg-white/5 p-3 rounded-lg">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Secured by Razorpay. Your payment information is safe.</span>
              </div>

              <Button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-lg py-6"
              >
                {loading ? 'Processing...' : `Pay ₹${course.price} Now`}
              </Button>

              <p className="text-xs text-gray-400 text-center">
                By clicking "Pay Now", you agree to our Terms of Service and Privacy Policy. 
                You will be redirected to Razorpay to complete your payment.
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}