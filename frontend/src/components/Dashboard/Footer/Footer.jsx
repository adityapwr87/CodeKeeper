import React from "react";
import { FiExternalLink } from "react-icons/fi";
import {
  SiLeetcode,
  SiCodechef,
  SiGeeksforgeeks,
  SiCodeforces,
} from "react-icons/si";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-grid">
        {/* Resources */}
        <div className="footer-col">
          <h4 className="footer-heading">📚 Resources</h4>
          <ul className="footer-links">
            <li>Getting Started</li>
            <li>Documentation</li>
            <li>Tutorials</li>
            <li>API Reference</li>
            <li>Community Forums</li>
          </ul>
        </div>

        {/* Platforms (NOW WITH REAL LINKS) */}
        <div className="footer-col">
          <h4 className="footer-heading">🔗 Platforms</h4>
          <ul className="footer-links">
            <li className="platform-link cf">
              <a
                href="https://codeforces.com/"
                target="_blank"
                rel="noreferrer"
              >
                <SiCodeforces className="brand-icon" /> Codeforces
                <FiExternalLink className="link-arrow" />
              </a>
            </li>

            <li className="platform-link lc">
              <a href="https://leetcode.com/" target="_blank" rel="noreferrer">
                <SiLeetcode className="brand-icon" /> Leetcode
                <FiExternalLink className="link-arrow" />
              </a>
            </li>

            <li className="platform-link gfg">
              <a
                href="https://www.geeksforgeeks.org/"
                target="_blank"
                rel="noreferrer"
              >
                <SiGeeksforgeeks className="brand-icon" /> Geeks for Geeks
                <FiExternalLink className="link-arrow" />
              </a>
            </li>

            <li className="platform-link at">
              <a href="https://atcoder.jp/" target="_blank" rel="noreferrer">
                <span className="at-badge">At</span> Atcoder
                <FiExternalLink className="link-arrow" />
              </a>
            </li>

            <li className="platform-link cc">
              <a
                href="https://www.codechef.com/"
                target="_blank"
                rel="noreferrer"
              >
                <SiCodechef className="brand-icon" /> Codechef
                <FiExternalLink className="link-arrow" />
              </a>
            </li>
          </ul>
        </div>

        {/* Community */}
        <div className="footer-col">
          <h4 className="footer-heading">👥 Community</h4>
          <ul className="footer-links">
            <li>Events</li>
            <li>Meetups</li>
            <li>Conferences</li>
            <li>Hackathons</li>
            <li>Jobs</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Zcoder. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
