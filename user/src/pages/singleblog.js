import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./blog.css";

function BlogDetails() {
  const { id } = useParams(); // get blog ID from URL
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchBlog();
    else setLoading(false);
  }, [id]);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`http://localhost:1337/api/blog/${id}`);
      if (res.data.success) {
        setBlog(res.data.data);
      } else {
        setBlog(null);
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
      setBlog(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h3 className="blog-loading">Loading blog...</h3>;
  if (!blog) return <h3 className="blog-loading">Blog not found ❌</h3>;

  return (
    <div className="blog-wrapper">
      <button className="blog-back-btn" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>

      <div className="blog-detail-card">
        <h2 className="blog-title">{blog.title}</h2>

        {blog.image && (
          <img
            src={`http://localhost:1337${blog.image}`}
            alt={blog.title}
            className="blog-detail-img"
          />
        )}

        <p className="blog-category"><b>Category:</b> {blog.category}</p>

        <p className="blog-desc-full">{blog.description}</p>
      </div>
    </div>
  );
}

export default BlogDetails;