import React from "react";
import "./blog.css";

const blogPosts = [
  {
    id: 1,
    title: "10 Resume Tips to Get Your Dream Job",
    date: "10",
    month: "Jan",
    category: "Career Tips",
    comments: "12 Comments",
    img: "/img/blog/single_blog_1.png",
    desc: "A strong resume is your first step to getting hired. Learn how to create a professional resume that stands out to recruiters and increases your interview chances."
  },
  {
    id: 2,
    title: "Top Skills Companies Are Hiring in 2026",
    date: "18",
    month: "Feb",
    category: "Technology",
    comments: "8 Comments",
    img: "/img/blog/single_blog_2.png",
    desc: "Discover the most in-demand skills companies are looking for in 2026 including AI, Cloud Computing, Data Science and Full Stack Development."
  },
  {
    id: 3,
    title: "How to Prepare for Your First Job Interview",
    date: "25",
    month: "Mar",
    category: "Interview",
    comments: "15 Comments",
    img: "/img/blog/single_blog_3.png",
    desc: "Interview preparation is key to success. Learn the most common interview questions and how to answer them confidently."
  },
  {
    id: 4,
    title: "Remote Jobs: The Future of Work",
    date: "04",
    month: "Apr",
    category: "Work Culture",
    comments: "6 Comments",
    img: "/img/blog/single_blog_4.png",
    desc: "Remote work is transforming the job market. Explore the benefits, challenges, and tips for finding remote opportunities."
  },
  {
    id: 5,
    title: "How Networking Can Boost Your Career",
    date: "12",
    month: "May",
    category: "Career Growth",
    comments: "9 Comments",
    img: "/img/blog/single_blog_5.png",
    desc: "Building professional relationships can open new doors. Learn how networking can help you discover hidden job opportunities."
  }
];

function Blog() {
  return (
    <>
      {/* Banner */}
      <div className="blog_banner">
        <h1>Career Blog</h1>
        <p>Career tips, job trends and professional advice</p>
      </div>

      <div className="blog_container">

        {/* Blog Posts */}
        <div className="blog_left">

          {blogPosts.map((post) => (
            <div className="blog_card" key={post.id}>

              <div className="blog_image">
                <img src={post.img} alt="" />

                <div className="blog_date">
                  <h3>{post.date}</h3>
                  <span>{post.month}</span>
                </div>

              </div>

              <div className="blog_content">
                <h2>{post.title}</h2>

                <p>{post.desc}</p>

                <div className="blog_meta">
                  <span>{post.category}</span>
                  <span>{post.comments}</span>
                </div>

              </div>

            </div>
          ))}

        </div>


        {/* Sidebar */}
        <div className="blog_sidebar">

          <div className="sidebar_box">
            <h3>Search</h3>
            <input type="text" placeholder="Search blog..." />
            <button>Search</button>
          </div>

          <div className="sidebar_box">
            <h3>Categories</h3>
            <ul>
              <li>Career Tips</li>
              <li>Technology</li>
              <li>Interview</li>
              <li>Remote Jobs</li>
              <li>Career Growth</li>
            </ul>
          </div>

          <div className="sidebar_box">
            <h3>Recent Posts</h3>
            <p>How to write a perfect resume</p>
            <p>Best websites to find jobs</p>
            <p>How to prepare for technical interviews</p>
          </div>

        </div>

      </div>
    </>
  );
}

export default Blog;