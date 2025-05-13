"use client";

import { useState } from "react";
import { FileEdit, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TreatmentContentProps {
    treatment: {
        id: string;
        date: string;
        content: string;
        summary: Record<string, string>;
    };
}

export function TreatmentContent({ treatment }: TreatmentContentProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(treatment.content);
    const [activeTab, setActiveTab] = useState("transcript");

    const handleSave = () => {
        setIsEditing(false);
        // In a real app, you would save the changes to the server here
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="p-6 w-full">
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Treatment Record</h1>
                        <p className="text-muted-foreground">Date: {formatDate(treatment.date)}</p>
                    </div>
                    <div>
                        {isEditing ? (
                            <Button onClick={handleSave}>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </Button>
                        ) : (
                            <Button variant="outline" onClick={() => setIsEditing(true)}>
                                <FileEdit className="mr-2 h-4 w-4" />
                                Edit Record
                            </Button>
                        )}
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="mb-4">
                        <TabsTrigger value="transcript">Transcript</TabsTrigger>
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                    </TabsList>

                    <TabsContent value="transcript">
                        {isEditing ? (
                            <Textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="min-h-[300px] w-full"
                            />
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Treatment Transcript</CardTitle>
                                    <CardDescription>
                                        Transcribed from the doctor&apos;s recording
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-wrap">{content}</p>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setActiveTab("summary")}
                                        className="ml-auto"
                                    >
                                        View Summary
                                    </Button>
                                </CardFooter>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="summary">
                        <Card>
                            <CardHeader>
                                <CardTitle>Treatment Summary</CardTitle>
                                <CardDescription>
                                    AI-generated summary of the treatment
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <dl className="space-y-4">
                                    {Object.entries(treatment.summary).map(([key, value]) => (
                                        <div key={key} className="grid grid-cols-4 gap-4">
                                            <dt className="col-span-1 font-medium">{key}:</dt>
                                            <dd className="col-span-3">{value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setActiveTab("transcript")}
                                    className="ml-auto"
                                >
                                    View Full Transcript
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
