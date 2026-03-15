import React from "react";
import "./singleblog.css";

function Singleblog() {
  return (
    <>
      {/* Banner */}
      <div className="bradcam_area bradcam_bg_1">
        <div className="container">
          <div className="bradcam_text">
            <h3>Single Blog</h3>
          </div>
        </div>
      </div>

      {/* Blog Area */}
      <section className="blog_area single-post-area section-padding">
        <div className="container">
          <div className="blog_layout">

            {/* LEFT SIDE */}
            <div className="posts_list">

              <div className="single-post">
                <div className="feature-img">
                  <img src="/img/blog/single_blog_1.png" alt="blog" />
                </div>

                <div className="blog_details">
                  <h2>How to Get Your Dream Job in 2026</h2>

                  <ul className="blog-info-link">
                    <li>Career Tips</li>
                    <li>03 Comments</li>
                  </ul>

                  <p>
                    Finding the right job requires preparation, research,
                    and networking. Modern companies expect candidates
                    to demonstrate technical skills, communication ability,
                    and problem-solving mindset.
                  </p>

                  <p>
                    Job portals make the process easier by connecting
                    job seekers and recruiters. Platforms now provide
                    AI-based job recommendations and resume analysis.
                  </p>

                  <div className="quote-wrapper">
                    <div className="quotes">
                      “Your career growth depends on continuous learning
                      and building strong professional connections.”
                    </div>
                  </div>

                  <p>
                    Whether you're applying for your first job or planning
                    a career switch, building your skills and portfolio
                    will greatly increase your chances of success.
                  </p>

                </div>
              </div>


              {/* Author */}
              <div className="blog-author">
                <img src="/img/blog/author.png" alt="author" />

                <div>
                  <h4>Harvard Milan</h4>
                  <p>
                    Career coach and technology writer sharing insights
                    about job markets, skills development, and career growth.
                  </p>
                </div>
              </div>


              {/* Comment Form */}
              <div className="comment-form">
                <h4>Leave a Reply</h4>

                <form className="comment_form">

                  <textarea
                    placeholder="Write Comment"
                    rows="6"
                  ></textarea>

                  <div className="form_row">
                    <input type="text" placeholder="Name" />
                    <input type="email" placeholder="Email" />
                  </div>

                  <input type="text" placeholder="Website" />

                  <button className="submit_btn">
                    Send Message
                  </button>

                </form>
              </div>

            </div>


            {/* RIGHT SIDEBAR */}
            <div className="blog_sidebar">

              <div className="sidebar_widget">
                <h4>Search</h4>
                <input type="text" placeholder="Search Keyword" />
                <button>Search</button>
              </div>

              <div className="sidebar_widget">
                <h4>Categories</h4>
                <ul>
                  <li>Career Tips (10)</li>
                  <li>Technology (8)</li>
                  <li>Interview (6)</li>
                  <li>Remote Jobs (4)</li>
                </ul>
              </div>

              <div className="sidebar_widget">
                <h4>Recent Posts</h4>

                <div className="recent_post">
                  <img src="/img/post/post_1.png" alt="" />
                  <p>How to build a strong resume</p>
                </div>

                <div className="recent_post">
                  <img src="/img/post/post_2.png" alt="" />
                  <p>Top programming skills in demand</p>
                </div>

              </div>

              <div className="sidebar_widget">
                <h4>Newsletter</h4>
                <input type="email" placeholder="Enter email" />
                <button>Subscribe</button>
              </div>

            </div>

          </div>
        </div>
      </section>
    </>
  );
}

export default Singleblog;