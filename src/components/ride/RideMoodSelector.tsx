
import { useState } from 'react';
import { MessageSquare, Headphones, Briefcase, VolumeX } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type RideMood = 'chatty' | 'quiet' | 'work' | 'music';

interface RideMoodSelectorProps {
  value: RideMood | undefined;
  onChange: (value: RideMood) => void;
}

interface MoodOption {
  value: RideMood;
  icon: React.ReactNode;
  label: string;
  description: string;
}

const RideMoodSelector = ({ value, onChange }: RideMoodSelectorProps) => {
  const moodOptions: MoodOption[] = [
    {
      value: 'chatty',
      icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
      label: 'Chatty',
      description: 'I'm open to conversation'
    },
    {
      value: 'quiet',
      icon: <VolumeX className="h-4 w-4 text-purple-500" />,
      label: 'Quiet',
      description: 'I prefer a quiet ride'
    },
    {
      value: 'work',
      icon: <Briefcase className="h-4 w-4 text-green-500" />,
      label: 'Work Mode',
      description: 'I need to focus on work'
    },
    {
      value: 'music',
      icon: <Headphones className="h-4 w-4 text-orange-500" />,
      label: 'Music',
      description: 'I enjoy music during rides'
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Ride Mood</CardTitle>
        <CardDescription>
          Let your driver know your preference
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <RadioGroup
          value={value}
          onValueChange={(newValue) => onChange(newValue as RideMood)}
          className="grid grid-cols-2 gap-2"
        >
          {moodOptions.map((option) => (
            <div key={option.value} className="relative">
              <RadioGroupItem
                value={option.value}
                id={`mood-${option.value}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`mood-${option.value}`}
                className="flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors peer-data-[state=checked]:bg-gocabs-primary/10 peer-data-[state=checked]:border-gocabs-primary/30 hover:bg-gray-50 dark:hover:bg-gray-800/30"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 mb-2">
                  {option.icon}
                </div>
                <p className="text-sm font-medium">{option.label}</p>
                <p className="text-xs text-center text-gray-500 mt-1">
                  {option.description}
                </p>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default RideMoodSelector;
