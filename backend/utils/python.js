const axios = require("axios");
const FormData = require("form-data");

exports.getEmbedding = async (buffer) => {
  const form = new FormData();
  form.append("file", buffer, "img.jpg");

  const res = await axios.post("http://localhost:8000/embed", form, {
    headers: form.getHeaders()
  });

  return res.data.embedding;
};

exports.compareEmbedding = async (stored, live) => {
  const res = await axios.post("http://localhost:8000/compare", {
    stored,
    live
  });
  return res.data;
};
