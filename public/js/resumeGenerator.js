/**
 * Resume Generator from Portfolio Content
 * This script scrapes data from the various sections of the portfolio 
 * and generates a structured resume in a modal.
 */

document.addEventListener('DOMContentLoaded', () => {
    const secretBtn = document.getElementById('secretResumeBtn');
    const modal = document.getElementById('resumeModal');
    const closeBtn = document.getElementById('closeResumeModal');
    const resumeBody = document.getElementById('resumeBody');
    const downloadTxtBtn = document.getElementById('downloadTxtBtn');
    const printPdfBtn = document.getElementById('printPdfBtn');
    
    let resumeData = null;

    // Toggle Modal
    secretBtn.addEventListener('click', async () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        if (!resumeData) {
            await generateResume();
        }
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Download TXT
    downloadTxtBtn.addEventListener('click', () => {
        if (!resumeData) return;
        
        const content = formatAsText(resumeData);
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resumeData.home.name.replace(/\s+/g, '_')}_Resume.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Print PDF
    printPdfBtn.addEventListener('click', () => {
        window.print();
    });

    async function generateResume() {
        try {
            // Show loader
            resumeBody.innerHTML = `
                <div class="resume-loader">
                    <div class="spinner"></div>
                    <p>Fetching and processing portfolio data...</p>
                </div>
            `;

            // Define endpoints to scrape
            const endpoints = [
                { id: 'home', url: '/' },
                { id: 'about', url: '/about' },
                { id: 'projects', url: '/projects' },
                { id: 'certificates', url: '/certificates' },
                { id: 'journey', url: '/journey' },
                { id: 'contact', url: '/contact' }
            ];

            // Fetch all pages in parallel
            const fetchPromises = endpoints.map(ep => 
                fetch(ep.url)
                .then(res => res.text())
                .then(html => ({ id: ep.id, html }))
                .catch(err => {
                    console.error(`Failed to fetch ${ep.url}:`, err);
                    return { id: ep.id, html: null };
                })
            );

            const results = await Promise.all(fetchPromises);
            const pages = {};
            results.forEach(res => {
                const parser = new DOMParser();
                pages[res.id] = parser.parseFromString(res.html, 'text/html');
            });

            // Extract Data
            resumeData = extractData(pages);

            // Render Resume
            renderResume(resumeData);

        } catch (error) {
            console.error('Resume generation failed:', error);
            resumeBody.innerHTML = `<p class="error">Something went wrong while generating the resume. Please try again.</p>`;
        }
    }

    function extractData(pages) {
        const data = {
            home: {},
            about: {},
            projects: [],
            certificates: [],
            journey: [],
            contact: {}
        };

        // 1. Home / Header
        const homePage = pages['home'];
        if (homePage) {
            data.home = {
                name: homePage.querySelector('.hero-title .highlight')?.innerText.trim() || 'Alvi',
                tagline: homePage.querySelector('.hero-subtitle')?.innerText.trim() || '',
                bio: homePage.querySelector('.hero-bio')?.innerText.trim() || '',
                photo: homePage.querySelector('.profile-img')?.src || null
            };
        }

        // 2. About
        const aboutPage = pages['about'];
        if (aboutPage) {
            data.about = {
                bio: aboutPage.querySelector('.bio-text')?.innerHTML.trim() || '',
                skills: Array.from(aboutPage.querySelectorAll('.skill-tag')).map(tag => ({
                    name: tag.innerText.trim(),
                    img: tag.querySelector('img')?.src || null
                })),
                location: aboutPage.querySelector('.profile-meta span:nth-child(1)')?.innerText.replace('📍', '').trim() || '',
                email: aboutPage.querySelector('.profile-meta span:nth-child(2)')?.innerText.replace('📧', '').trim() || ''
            };
        }

        // 3. Projects
        const projectsPage = pages['projects'];
        if (projectsPage) {
            const projectCards = projectsPage.querySelectorAll('.project-card');
            data.projects = Array.from(projectCards).map(card => ({
                title: card.querySelector('.project-title')?.innerText.trim() ,
                description: card.querySelector('.project-excerpt')?.innerText.trim(),
                image: card.querySelector('.project-image img')?.src,
                tags: Array.from(card.querySelectorAll('.tag')).map(t => t.innerText.trim())
            }));
        }

        // 4. Certificates
        const certPage = pages['certificates'];
        if (certPage) {
            const certCards = certPage.querySelectorAll('.certificate-card');
            data.certificates = Array.from(certCards).map(card => ({
                title: card.querySelector('.cert-title')?.innerText.trim(),
                issuer: card.querySelector('.cert-issuer')?.innerText.replace('Issued by', '').trim(),
                date: card.querySelector('.cert-date')?.innerText.trim(),
                category: card.querySelector('.cert-category')?.innerText.trim(),
                image: card.querySelector('.cert-image img')?.src
            }));
        }

        // 5. Journey
        const journeyPage = pages['journey'];
        if (journeyPage) {
            const items = journeyPage.querySelectorAll('.timeline-item');
            data.journey = Array.from(items).map(item => ({
                title: item.querySelector('.timeline-title')?.innerText.trim(),
                description: item.querySelector('.timeline-desc')?.innerText.trim(),
                date: item.querySelector('.timeline-date')?.innerText.trim(),
                image: item.querySelector('.timeline-img')?.src
            }));
        }

        // 6. Contact
        const contactPage = pages['contact'];
        if (contactPage) {
            const contactItems = contactPage.querySelectorAll('.contact-item');
            contactItems.forEach(item => {
                const label = item.querySelector('.contact-label')?.innerText.toLowerCase().trim();
                const value = item.querySelector('.contact-value')?.innerText.trim();
                if (label && value) {
                    if (label.includes('email')) data.contact.email = value;
                    if (label.includes('location')) data.contact.location = value;
                    if (label.includes('social') || label.includes('github') || label.includes('linkedin')) {
                        if (!data.contact.socials) data.contact.socials = [];
                        data.contact.socials.push({ label, value });
                    }
                }
            });
            
            // Fallback from footer if contact page feels empty
            if (!data.contact.email) {
                 const footerEmail = homePage?.querySelector('.footer-contact li:nth-child(1) a')?.innerText;
                 if (footerEmail) data.contact.email = footerEmail;
            }
        }

        return data;
    }

    function renderResume(data) {
        let html = `<div class="resume-container">`;

        // Home / Header
        html += `
            <header class="resume-header">
                ${data.home.photo ? `<img src="${data.home.photo}" class="resume-profile-img" alt="${data.home.name}">` : ''}
                <div class="resume-header-info">
                    <h1>${data.home.name}</h1>
                    <p class="tagline">${data.home.tagline}</p>
                    <div class="resume-item-meta">
                        ${data.contact.email ? `<span>📧 ${data.contact.email}</span>` : ''}
                        ${data.contact.location ? `<span style="margin-left: 1rem">📍 ${data.contact.location}</span>` : ''}
                    </div>
                </div>
            </header>
        `;

        // About
        html += `
            <section class="resume-section">
                <h2 class="resume-section-title">About Me</h2>
                <div class="resume-bio">${data.about.bio || data.home.bio}</div>
                <div class="category-skills" style="margin-top: 1.5rem">
                    ${data.about.skills.map(s => `
                        <div class="skill-tag">
                            ${s.img ? `<img src="${s.img}" style="width: 16px; height: 16px; margin-right: 5px;">` : '•'} 
                            ${s.name}
                        </div>
                    `).join('')}
                </div>
            </section>
        `;

        // Projects
        if (data.projects.length > 0) {
            html += `
                <section class="resume-section">
                    <h2 class="resume-section-title">Key Projects</h2>
                    <div class="resume-grid">
                        ${data.projects.map(p => `
                            <div class="resume-item">
                                <h3>${p.title}</h3>
                                <div class="project-tags">
                                    ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                                </div>
                                <p>${p.description}</p>
                                ${p.image ? `<img src="${p.image}" class="resume-item-img" alt="${p.title}">` : ''}
                            </div>
                        `).join('')}
                    </div>
                </section>
            `;
        }

        // Certificates
        if (data.certificates.length > 0) {
            html += `
                <section class="resume-section">
                    <h2 class="resume-section-title">Certifications</h2>
                    <div class="resume-grid">
                        ${data.certificates.map(c => `
                            <div class="resume-item">
                                <h3>${c.title}</h3>
                                <div class="resume-item-meta">${c.issuer} | ${c.date}</div>
                                ${c.image ? `<img src="${c.image}" class="resume-item-img" style="max-height: 150px; width: auto;" alt="${c.title}">` : ''}
                            </div>
                        `).join('')}
                    </div>
                </section>
            `;
        }

        // Journey
        if (data.journey.length > 0) {
            html += `
                <section class="resume-section">
                    <h2 class="resume-section-title">Journey & Experience</h2>
                    <div class="resume-timeline">
                        ${data.journey.map(j => `
                            <div class="resume-item">
                                <div class="resume-item-meta">${j.date}</div>
                                <h3>${j.title}</h3>
                                <p>${j.description}</p>
                                ${j.image ? `<img src="${j.image}" class="resume-item-img" style="max-width: 200px;" alt="${j.title}">` : ''}
                            </div>
                        `).join('')}
                    </div>
                </section>
            `;
        }

        // Contact Final
        html += `
            <footer class="resume-section" style="border-top: 1px solid var(--border); padding-top: 2rem;">
                <h2 class="resume-section-title">Contact Information</h2>
                <div class="resume-item-meta">
                    <p>Email: ${data.contact.email || 'N/A'}</p>
                    <p>Location: ${data.contact.location || 'N/A'}</p>
                    ${data.contact.socials ? data.contact.socials.map(s => `<p>${s.label.charAt(0).toUpperCase() + s.label.slice(1)}: ${s.value}</p>`).join('') : ''}
                </div>
            </footer>
        `;

        html += `</div>`;
        resumeBody.innerHTML = html;
    }

    function formatAsText(data) {
        let text = `RESUME: ${data.home.name.toUpperCase()}\n`;
        text += `${data.home.tagline}\n`;
        text += `========================================\n\n`;
        
        text += `CONTACT\n`;
        text += `Email: ${data.contact.email || 'N/A'}\n`;
        text += `Location: ${data.contact.location || 'N/A'}\n\n`;
        
        text += `ABOUT\n`;
        text += `${data.home.bio}\n\n`;
        
        text += `SKILLS\n`;
        text += data.about.skills.map(s => `• ${s.name}`).join(', ') + `\n\n`;
        
        text += `PROJECTS\n`;
        data.projects.forEach(p => {
            text += `- ${p.title} (${p.tags.join(', ')})\n`;
            text += `  ${p.description}\n\n`;
        });
        
        text += `CERTIFICATIONS\n`;
        data.certificates.forEach(c => {
            text += `- ${c.title} (${c.issuer}, ${c.date})\n`;
        });
        text += `\n`;
        
        text += `JOURNEY\n`;
        data.journey.forEach(j => {
            text += `[${j.date}] ${j.title}\n`;
            text += `  ${j.description}\n\n`;
        });
        
        return text;
    }
});
