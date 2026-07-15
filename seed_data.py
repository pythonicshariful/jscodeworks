import json
from models import (
    db, User, HeroSection, AboutSection, Service, Project,
    BlogPost, TechItem, TeamMember, Testimonial, StatMetric,
    ThemeSettings, AnimationSettings, ContactSettings, ActivityLog
)

def seed_database():
    # Create / Ensure Secret Admin User darkwolf
    user = User.query.filter((User.username == 'darkwolf') | (User.email == 'pythonicshariful@gmail.com') | (User.username == 'admin')).first()
    if not user:
        user = User(
            username='darkwolf',
            email='pythonicshariful@gmail.com',
            role='super_admin',
            two_factor_enabled=True
        )
        user.set_password('As125125@')
        db.session.add(user)
    else:
        user.username = 'darkwolf'
        user.email = 'pythonicshariful@gmail.com'
        user.set_password('As125125@')
        user.two_factor_enabled = True
    db.session.commit()

    # Seed Hero Section
    if not HeroSection.query.first():
        hero = HeroSection(
            badge_text="Next-Gen Software Studio",
            headline="Engineering Software Beyond Expectations",
            subheadline="We build intelligent software solutions that transform visionary ideas into high-performance digital products.",
            cta_primary_text="Start Your Project",
            cta_primary_link="#contact",
            cta_secondary_text="Explore Portfolio",
            cta_secondary_link="#portfolio",
            python_code_lines=json.dumps([
                "import jscodeworks as jscw",
                "from jscw.ai import NeuralEngine",
                "from jscw.cloud import KubernetesMesh",
                "",
                "# Initialize Studio Infrastructure",
                "studio = jscw.Studio(founders=['Jahidur Islam', 'Shariful Islam'])",
                "neural_core = NeuralEngine(model='GPT-Custom', precision='fp16')",
                "",
                "def build_enterprise_app(client_vision):",
                "    architecture = studio.design_system(quality='ENTERPRISE_PREMIUM')",
                "    cloud_mesh = KubernetesMesh.provision(scaling='auto')",
                "    return studio.compile(vision=client_vision, AI=neural_core)",
                "",
                "# Execute Deployment Pipeline",
                "app = build_enterprise_app('Next-Gen SaaS Ecosystem')",
                "app.launch(status='PRODUCTION_READY')"
            ])
        )
        db.session.add(hero)

    # Seed About Section
    if not AboutSection.query.first():
        about = AboutSection(
            tagline="Pioneering Digital Architectures",
            title="Where World-Class Code Meets Futuristic Design",
            story="JS CodeWorks was founded with a singular relentless vision: to bridge the gap between complex engineering algorithms and breathtaking visual UI/UX design. We treat every line of code like fine architecture, crafting web applications, mobile platforms, and AI integrations that set new standards in digital craftsmanship.",
            mission="To deliver ultra-reliable, beautifully designed, and scalable software solutions that give our global clients an enduring competitive edge.",
            vision="To be recognized as a world-leading software engineering agency known for shaping the future of interactive technology.",
            core_values_json=json.dumps([
                {"title": "Architectural Excellence", "desc": "Clean, modular, resilient software standards from backend to frontend.", "icon": "layers"},
                {"title": "Aesthetic Perfection", "desc": "Cinematic visual design, dynamic motion, and human-centric micro-interactions.", "icon": "sparkles"},
                {"title": "AI & Innovation First", "desc": "Integrating intelligent AI models and cloud automation into modern workflows.", "icon": "cpu"},
                {"title": "Uncompromised Velocity", "desc": "Agile deployment cycles backed by robust continuous integration and automated testing.", "icon": "zap"}
            ]),
            timeline_json=json.dumps([
                {"year": "2021", "title": "Foundation & Vision", "desc": "JS CodeWorks established by Jahidur Islam and Shariful Islam as a boutique engineering firm."},
                {"year": "2022", "title": "Enterprise Expansion", "desc": "Scaled operations into cloud architecture, ERP integrations, and custom SaaS platforms."},
                {"year": "2023", "title": "AI & WebGL Breakthrough", "desc": "Integrated advanced AI automation and high-performance WebGL 3D graphics into core product design."},
                {"year": "2024", "title": "Global Recognition", "desc": "Engineered 100+ mission-critical platforms across North America, Europe, and Asia."},
                {"year": "2025+", "title": "Next-Gen Ecosystem", "desc": "Pioneering autonomous AI software workflows and immersive 3D digital experiences."}
            ])
        )
        db.session.add(about)

    # Seed Services
    if Service.query.count() == 0:
        services_data = [
            {
                "title": "Custom Software Development",
                "icon_3d": "code",
                "short_desc": "Bespoke software systems engineered to solve your exact business complexities with high reliability.",
                "full_desc": "We build tailormade software applications using modern design patterns, scalable microservices, and reliable automated testing pipelines.",
                "capabilities_json": json.dumps(["Enterprise Architectures", "High-Throughput Engines", "Legacy System Refactoring", "Automated QA & CI/CD"]),
                "border_glow_color": "#2563EB",
                "order": 1
            },
            {
                "title": "Web Application Development",
                "icon_3d": "layers",
                "short_desc": "High-performance web applications with reactive UI, WebGL visual effects, and fluid user flows.",
                "full_desc": "Combining cutting-edge frontend frameworks with lightning-fast backend microservices for maximum responsiveness and search engine optimization.",
                "capabilities_json": json.dumps(["React / Next.js", "Flask / Django / Python", "WebGL & Three.js 3D Visuals", "PWA & Real-Time WebSockets"]),
                "border_glow_color": "#06B6D4",
                "order": 2
            },
            {
                "title": "Mobile App Development",
                "icon_3d": "mobile",
                "short_desc": "Native performance iOS and Android applications with intuitive micro-animations and offline sync capabilities.",
                "full_desc": "We deliver pixel-perfect mobile software for smartphones, tablets, and wearables built with Flutter, React Native, and Swift/Kotlin.",
                "capabilities_json": json.dumps(["iOS & Android Solutions", "Cross-Platform Native Speed", "Biometric & Push Notifications", "Offline First Storage"]),
                "border_glow_color": "#7C3AED",
                "order": 3
            },
            {
                "title": "AI & Workflow Automation",
                "icon_3d": "ai",
                "short_desc": "Custom machine learning pipelines, LLM fine-tuning, autonomous agents, and process automation.",
                "full_desc": "Empower your business operations with predictive models, natural language processing, intelligent document analysis, and custom RAG engines.",
                "capabilities_json": json.dumps(["Custom LLM & Agent Integration", "Predictive Analytics", "Automated Document Processing", "Intelligent Chatbots & RAG"]),
                "border_glow_color": "#EC4899",
                "order": 4
            },
            {
                "title": "SaaS Platform Development",
                "icon_3d": "cloud",
                "short_desc": "Multi-tenant cloud SaaS products engineered for high scalability, recurring billing, and real-time analytics.",
                "full_desc": "End-to-end multi-tenant platform architecture including billing integration (Stripe/PayPal), user role permissions, metric telemetry, and zero-downtime deployment.",
                "capabilities_json": json.dumps(["Multi-Tenant Architecture", "Stripe Subscription Billing", "Usage Analytics & Metrics", "Role-Based Security"]),
                "border_glow_color": "#3B82F6",
                "order": 5
            },
            {
                "title": "API & Cloud Infrastructure",
                "icon_3d": "database",
                "short_desc": "Resilient RESTful and GraphQL APIs deployed on Kubernetes container meshes with automated auto-scaling.",
                "full_desc": "Architecting resilient backend microservices on AWS, GCP, or Azure with Redis caching, PostgreSQL clustering, and proactive server telemetry.",
                "capabilities_json": json.dumps(["High-Speed REST & GraphQL APIs", "Docker & Kubernetes Mesh", "Redis Caching & Pub/Sub", "AWS / GCP Infrastructure"]),
                "border_glow_color": "#10B981",
                "order": 6
            },
            {
                "title": "UI/UX Design Studio",
                "icon_3d": "palette",
                "short_desc": "Aesthetic design systems, interactive prototypes, dark mode color grading, and motion graphics.",
                "full_desc": "We transform raw software functionality into intuitive, elegant digital interfaces that captivate users from first interaction.",
                "capabilities_json": json.dumps(["Design Systems & UI Kits", "Interactive Figma Prototypes", "Micro-Interactions & Motion", "Usability & Accessibility Testing"]),
                "border_glow_color": "#F59E0B",
                "order": 7
            },
            {
                "title": "ERP & CRM Custom Systems",
                "icon_3d": "shield",
                "short_desc": "Enterprise resource management software tailored specifically to your organization's internal workflows.",
                "full_desc": "Streamline operations, inventory, client relations, and financial reporting with secure, unified custom enterprise management suites.",
                "capabilities_json": json.dumps(["Custom Resource Management", "Inventory & Order Tracking", "Role Audit Logging", "Third-Party Service Connectors"]),
                "border_glow_color": "#6366F1",
                "order": 8
            }
        ]
        for s in services_data:
            db.session.add(Service(**s))

    # Seed Projects
    if Project.query.count() == 0:
        projects_data = [
            {
                "title": "Aether AI - Autonomous Design Studio",
                "slug": "aether-ai-studio",
                "tagline": "Next-Gen Generative AI Engine for Enterprise Product Teams",
                "category": "AI & Web App",
                "description": "A high-performance generative design platform leveraging custom Python AI pipelines and real-time WebGL renderers.",
                "client_name": "Aether Dynamics Inc.",
                "image_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80&fm=webp",
                "preview_video_url": "",
                "tech_stack_json": json.dumps(["Python", "Flask", "PyTorch", "React", "Three.js", "AWS"]),
                "live_url": "https://jscodeworks.com",
                "github_url": "https://github.com",
                "device_type": "desktop",
                "is_featured": True,
                "order": 1
            },
            {
                "title": "NexusCloud - Cloud Mesh Control Center",
                "slug": "nexuscloud-mesh",
                "tagline": "Real-time Telemetry & Microservices Monitoring Dashboard",
                "category": "SaaS & Cloud",
                "description": "Unified observability platform processing millions of metrics per second with 3D node network visualizer.",
                "client_name": "Nexus Systems Tech",
                "image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80&fm=webp",
                "preview_video_url": "",
                "tech_stack_json": json.dumps(["Next.js", "TypeScript", "Docker", "PostgreSQL", "Redis", "GSAP"]),
                "live_url": "https://jscodeworks.com",
                "github_url": "https://github.com",
                "device_type": "laptop",
                "is_featured": True,
                "order": 2
            },
            {
                "title": "Pulse Pay - Quantum Mobile Wallet",
                "slug": "pulse-pay-wallet",
                "tagline": "Instant Cross-Border Crypto & Fiat Mobile Financial App",
                "category": "Mobile App",
                "description": "Ultra-secure mobile transaction experience featuring biometric passkeys, real-time FX charts, and instant push settlement.",
                "client_name": "Pulse Fintech Global",
                "image_url": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80&fm=webp",
                "preview_video_url": "",
                "tech_stack_json": json.dumps(["Flutter", "Dart", "Python API", "PostgreSQL", "WebSockets"]),
                "live_url": "https://jscodeworks.com",
                "github_url": "https://github.com",
                "device_type": "mobile",
                "is_featured": True,
                "order": 3
            },
            {
                "title": "OmniERP - Intelligent Supply Chain",
                "slug": "omnierp-supply-chain",
                "tagline": "Autonomous Logistics & Inventory Management Platform",
                "category": "Enterprise ERP",
                "description": "Complete enterprise management suite integrating automated reordering, GPS fleet tracking, and financial ledgers.",
                "client_name": "LogiCorp Alliance",
                "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80&fm=webp",
                "preview_video_url": "",
                "tech_stack_json": json.dumps(["Python", "Django", "PostgreSQL", "React", "Docker"]),
                "live_url": "https://jscodeworks.com",
                "github_url": "https://github.com",
                "device_type": "desktop",
                "is_featured": True,
                "order": 4
            }
        ]
        for p in projects_data:
            db.session.add(Project(**p))

    # Seed Tech Items for 3D Sphere Orbit
    if TechItem.query.count() == 0:
        tech_data = [
            {"name": "Python", "category": "Backend", "color": "#3776AB", "orbit_radius": 3.5, "speed": 1.2, "order": 1},
            {"name": "Flask", "category": "Backend", "color": "#000000", "orbit_radius": 3.8, "speed": 0.9, "order": 2},
            {"name": "Django", "category": "Backend", "color": "#092E20", "orbit_radius": 4.2, "speed": 1.1, "order": 3},
            {"name": "React", "category": "Frontend", "color": "#61DAFB", "orbit_radius": 3.4, "speed": 1.4, "order": 4},
            {"name": "Next.js", "category": "Frontend", "color": "#000000", "orbit_radius": 4.0, "speed": 0.8, "order": 5},
            {"name": "Docker", "category": "DevOps", "color": "#2496ED", "orbit_radius": 4.5, "speed": 1.0, "order": 6},
            {"name": "PostgreSQL", "category": "Database", "color": "#4169E1", "orbit_radius": 3.6, "speed": 1.3, "order": 7},
            {"name": "AWS", "category": "Cloud", "color": "#FF9900", "orbit_radius": 4.1, "speed": 1.0, "order": 8},
            {"name": "GitHub", "category": "DevOps", "color": "#FFFFFF", "orbit_radius": 3.9, "speed": 1.2, "order": 9},
            {"name": "Linux", "category": "OS", "color": "#FCC624", "orbit_radius": 4.4, "speed": 0.9, "order": 10},
            {"name": "Three.js", "category": "Graphics", "color": "#000000", "orbit_radius": 3.3, "speed": 1.5, "order": 11},
            {"name": "Redis", "category": "Database", "color": "#DC382D", "orbit_radius": 4.3, "speed": 1.1, "order": 12}
        ]
        for t in tech_data:
            db.session.add(TechItem(**t))

    # Seed Team Members (Founders Jahidur Islam & Shariful Islam)
    if TeamMember.query.count() == 0:
        team_data = [
            {
                "name": "Jahidur Islam",
                "role": "CEO & Founder",
                "bio": "Visionary software engineer and system architect specializing in Python backends, AI pipelines, cloud infrastructure, and enterprise scalability.",
                "image_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80&fm=webp",
                "social_links_json": json.dumps({"github": "https://github.com", "linkedin": "https://linkedin.com", "twitter": "https://twitter.com"}),
                "is_founder": True,
                "order": 1
            },
            {
                "name": "Shariful Islam",
                "role": "Co-Founder & Chief Technology Officer",
                "bio": "Product strategist and system architect with over a decade of experience building digital experiences, UI/UX systems, and high-growth SaaS platforms.",
                "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80&fm=webp",
                "social_links_json": json.dumps({"github": "https://github.com", "linkedin": "https://linkedin.com", "twitter": "https://twitter.com"}),
                "is_founder": True,
                "order": 2
            }
        ]
        for tm in team_data:
            db.session.add(TeamMember(**tm))

    # Seed Testimonials
    if Testimonial.query.count() == 0:
        testimonials_data = [
            {
                "client_name": "Marcus Vance",
                "role": "VP of Technology",
                "company": "Aether Dynamics",
                "photo_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80&fm=webp",
                "content": "JS CodeWorks delivered our flagship platform ahead of schedule with code quality and visual polish that completely wowed our board of investors.",
                "rating": 5,
                "order": 1
            },
            {
                "client_name": "Elena Rostova",
                "role": "Founder & CEO",
                "company": "Nexus Systems",
                "photo_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80&fm=webp",
                "content": "Working with Jahidur, Shariful, and their engineering team was a masterclass in modern software development. Extremely reliable and innovative.",
                "rating": 5,
                "order": 2
            },
            {
                "client_name": "David Sterling",
                "role": "Chief Innovation Officer",
                "company": "Pulse Fintech",
                "photo_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80&fm=webp",
                "content": "The WebGL visual presentation and zero-latency microservice architecture they built transformed our app from ordinary to extraordinary.",
                "rating": 5,
                "order": 3
            }
        ]
        for test in testimonials_data:
            db.session.add(Testimonial(**test))

    # Seed Stat Metrics
    if StatMetric.query.count() == 0:
        stats_data = [
            {"label": "Projects Completed", "value": 150, "suffix": "+", "order": 1},
            {"label": "Happy Clients", "value": 85, "suffix": "+", "order": 2},
            {"label": "Countries Served", "value": 24, "suffix": "+", "order": 3},
            {"label": "Years Experience", "value": 8, "suffix": "+", "order": 4},
            {"label": "Client Satisfaction", "value": 99, "suffix": "%", "order": 5}
        ]
        for stat in stats_data:
            db.session.add(StatMetric(**stat))

    # Seed Blog Posts
    if BlogPost.query.count() == 0:
        blog_data = [
            {
                "title": "Architecting High-Performance Flask Backends with WebGL Frontend Canvas",
                "slug": "architecting-flask-webgl-performance",
                "category": "Engineering",
                "excerpt": "How to decouple heavy Python computation from real-time browser 3D graphics for silky smooth 60 FPS performance.",
                "content": "<p>When constructing modern interactive web applications, balancing server-side compute velocity with complex 3D shader graphics is paramount...</p>",
                "cover_image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80&fm=webp",
                "author_name": "Jahidur Islam",
                "tags_json": json.dumps(["Python", "Flask", "Three.js", "Performance"]),
                "read_time": "6 min read"
            },
            {
                "title": "The Art of Micro-Interactions in Software UI Design",
                "slug": "art-of-micro-interactions",
                "category": "Design & UI",
                "excerpt": "Why subtle motion physics, spatial lighting, and glassmorphism create emotional connection and instant user trust.",
                "content": "<p>Modern software visual experiences require more than just clean typography; they require tactile physics and responsive light depth...</p>",
                "cover_image": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80&fm=webp",
                "author_name": "Shariful Islam",
                "tags_json": json.dumps(["UI/UX", "GSAP", "Design System", "Motion"]),
                "read_time": "5 min read"
            }
        ]
        for bp in blog_data:
            db.session.add(BlogPost(**bp))

    # Seed Settings
    if not ThemeSettings.query.first():
        db.session.add(ThemeSettings())
    if not AnimationSettings.query.first():
        db.session.add(AnimationSettings())
    if not ContactSettings.query.first():
        db.session.add(ContactSettings())

    db.session.commit()
    print("Database successfully seeded with JS CodeWorks initial data!")
