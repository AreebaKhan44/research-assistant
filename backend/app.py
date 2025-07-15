from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
import os
import fitz  # PyMuPDF
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# ✅ Load OpenAI key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY not found in environment variables.")
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

# ✅ Set paths
CHROMA_DIR = "./chroma_db"
UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ✅ Initialize models
embedding_model = OpenAIEmbeddings()
db = Chroma(persist_directory=CHROMA_DIR, embedding_function=embedding_model)
llm = ChatOpenAI(model_name="gpt-4")
qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=db.as_retriever())

# ✅ Upload Route
@app.route("/upload", methods=["POST"])
def upload():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    filepath = os.path.join(UPLOAD_DIR, file.filename)
    file.save(filepath)

    doc = fitz.open(filepath)
    text = "\n".join([page.get_text() for page in doc])

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
    docs = splitter.split_documents([Document(page_content=text)])
    db.add_documents(docs)

    return jsonify({"status": "Uploaded and embedded successfully."})

# ✅ Ask Route
@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    question = data.get("question")

    if not question:
        return jsonify({"error": "Question is required"}), 400

    result = qa_chain.run(question)
    return jsonify({"answer": result})

# ✅ Start server
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
