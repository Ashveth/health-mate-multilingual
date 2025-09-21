import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface HealthRecordsDisclaimerProps {
  onClose?: () => void;
}

export const HealthRecordsDisclaimer: React.FC<HealthRecordsDisclaimerProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6"
    >
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-orange-800">
            <Shield className="w-6 h-6" />
            Health Records Privacy Notice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-orange-200">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-orange-800 mb-2">Important Privacy Protection</h3>
              <p className="text-orange-700 mb-3">
                <strong>For your safety, I cannot store or display health records.</strong> 
                This system does not have HIPAA/GDPR compliance enabled for sensitive medical data.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-orange-700">
              <Lock className="w-4 h-4" />
              <span>Your medical records require secure, encrypted storage</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-orange-700">
              <Shield className="w-4 h-4" />
              <span>Healthcare providers have specialized systems for this</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-orange-800 mb-2">What you can do:</h4>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• Contact your healthcare provider directly for medical records</li>
              <li>• Use your hospital's patient portal for secure access</li>
              <li>• Ask me general health questions instead</li>
              <li>• Book appointments with doctors through this system</li>
            </ul>
          </div>

          {onClose && (
            <div className="flex justify-end pt-4">
              <Button onClick={onClose} variant="outline" className="border-orange-300 text-orange-700">
                I Understand
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};