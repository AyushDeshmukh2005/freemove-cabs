
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type MoodOption = {
  id: string;
  label: string;
  description: string;
};

const moodOptions: MoodOption[] = [
  { id: "chatty", label: "Chatty", description: "I'm open to conversation" },
  { id: "quiet", label: "Quiet", description: "I prefer silence" },
  { id: "work", label: "Work Mode", description: "I need to focus" },
  { id: "music", label: "Music", description: "Let's enjoy some tunes" },
  { id: "guide", label: "Tour Guide", description: "Share local insights" }
];

export const RideMoodSelector = ({ 
  selectedMood,
  onMoodSelect
}: { 
  selectedMood: string | null;
  onMoodSelect: (mood: string) => void;
}) => {
  return (
    <Card className="w-full">
      <CardContent className="pt-4">
        <Label className="block mb-3 text-lg">How do you feel today?</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {moodOptions.map((option) => (
            <Button
              key={option.id}
              variant={selectedMood === option.id ? "default" : "outline"}
              className="flex flex-col h-auto py-3 justify-start"
              onClick={() => onMoodSelect(option.id)}
            >
              <span className="font-medium">{option.label}</span>
              <span className="text-xs mt-1 text-muted-foreground">{option.description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RideMoodSelector;
