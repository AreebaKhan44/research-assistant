import React, { useState } from "react";
import axios from "axios";
import { Button } from "./components/buttton";
import { Input } from "./components/input";
import { Textarea } from "./components/textarea";
import { Card, CardContent } from "./components/card";
import { UploadCloud, Brain } from "lucide-react";
import { motion } from "framer-motion";

export default function DelvAIDashboard() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    try {
      await axios.post("http://localhost:5000/upload", formData);
      alert("File uploaded and embedded successfully.");
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleQuestionSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/ask", { question });
      setAnswer(res.data.answer);
    } catch (err) {
      console.error(err);
      setAnswer("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center text-gray-600">
          📊 Research Assistant
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-10">
          {/* Upload Section */}
          <Card className="shadow-lg border border-gray-200 bg-white">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-700">
                📄 Upload PDF
              </h2>
              <Input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <Button
                className="mt-5 w-full"
                onClick={handleFileUpload}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : <><UploadCloud className="mr-2" /> Upload PDF</>}
              </Button>
            </CardContent>
          </Card>

          {/* Ask Section */}
          <Card className="shadow-lg border border-gray-200 bg-white">
  <CardContent className="p-6">
    <h2 className="text-2xl font-semibold mb-6 text-gray-700">
      ❓ Ask a Question
    </h2>
    <Textarea
  placeholder="Ask any questions"
  value={question}
  onChange={(e) => setQuestion(e.target.value)}
  className="absolute w-full h-full bg-inherit m-0 p-0 border-none resize-none text-gray-800 font-sans text-base
  relative w-[300px] h-[125px] p-2.5 rounded-[5px] border border-lightBlue-300 bg-lightBlue-200 before:content-[''] before:absolute before:right-full before:top-[26px] before:w-0 before:h-0 before:border-t-[13px] before:border-t-transparent before:border-r-[26px] before:border-r-lightBlue-200 before:border-b-[13px] before:border-b-transparent
  "
/>
    <Button
      className="mt-6 w-full text-lg py-3"
      onClick={handleQuestionSubmit}
      disabled={loading}
    >
      {loading ? "Thinking..." : (
        <>
          <Brain className="mr-2" /> Get Answer
        </>
      )}
    </Button>
  </CardContent>
</Card>

        </div>

        {/* Answer Display */}
        {answer && (
          <Card className="mt-12 shadow-lg border border-gray-200 bg-white">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-green-700">
                🧠 Answer
              </h2>
              <p className="text-gray-800 leading-relaxed whitespace-pre-line text-lg">
                {answer}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
}




