import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./blog.css";

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/blogs"); // Backend URL
      if (res.data.success) {
        setBlogs(res.data.data);
      }
    } catch (err) {
      console.log("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h3 className="blog-loading">Loading blogs...</h3>;
  }

  return (
    <div className="blog-wrapper">
      <h2 className="blog-header">Job Portal Blogs</h2>

      <div className="blog-grid">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div className="blog-card" key={blog.id}>
              <img
                src={blog.image}
                alt={blog.title}
                className="blog-img"
              />
              <div className="blog-content">
                <h4 className="blog-title">{blog.title}</h4>
                <p className="blog-desc">
                  {blog.description
                    ? blog.description.substring(0, 100) + "..."
                    : "No description available."}
                </p>
                <p className="blog-category"><b>{blog.category}</b></p>
                <Link to={`/blog/${blog.id}`} className="blog-btn">
                  Read More
                </Link>
              </div>
            </div>
          ))
        ) : (
          <h4 className="no-blogs">No blogs found</h4>
        )}
      </div>
    </div>
  );
}

export default Blog;