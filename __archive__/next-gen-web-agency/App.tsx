import React, { useState, useEffect } from 'react';
import Button from './components/Button';

// --- ICONS ---
const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const CodeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-brand-accent" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
);

const DesignIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-brand-accent" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385m5.043.025a2.25 2.25 0 012.4-2.245 4.5 4.5 0 00-8.4 2.245c0 .399.078.78.22 1.128zm0 0a15.998 15.998 0 00-3.388 1.62m5.043-.025a15.998 15.998 0 01-1.622 3.385m1.622-3.385a2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385" />
    </svg>
);

const SeoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-brand-accent" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
);


// --- HEADER COMPONENT ---
const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navLinks = ["Services", "Work", "About", "Contact"];

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    return (
        <>
            <header className="py-6 fixed top-0 left-0 right-0 z-40 bg-neumorphic-background/80 backdrop-blur-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <a href="#" className="text-xl font-bold tracking-wider text-brand-dark">Agency.</a>
                    <div className="flex items-center space-x-4">
                         <nav className="hidden md:flex items-center space-x-2">
                             <a href="#menu" onClick={(e) => {e.preventDefault(); setIsMenuOpen(true)}} className="px-4 py-2 text-sm font-medium text-brand-dark rounded-full hover:shadow-neumorphic-inset-sm active:shadow-neumorphic-inset-sm transition-all duration-200">Menu</a>
                             <a href="#signin" className="px-4 py-2 text-sm font-medium text-brand-dark rounded-full hover:shadow-neumorphic-inset-sm active:shadow-neumorphic-inset-sm transition-all duration-200">Sign In</a>
                         </nav>
                         <Button variant="primary" className="hidden md:inline-flex px-6 py-3">Sign Up</Button>
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-3 bg-neumorphic-background rounded-full shadow-neumorphic-outset-sm active:shadow-neumorphic-inset-sm">
                                {isMenuOpen ? <XIcon className="h-5 w-5 text-brand-dark"/> : <MenuIcon className="h-5 w-5 text-brand-dark"/>}
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            
            {isMenuOpen && (
                 <div className="fixed inset-0 bg-neumorphic-background z-50 flex flex-col items-center justify-center animate-fade-in">
                    <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-4 sm:top-8 sm:right-6 lg:right-8 p-3 bg-neumorphic-background rounded-full shadow-neumorphic-outset-sm active:shadow-neumorphic-inset-sm">
                        <XIcon className="h-6 w-6 text-brand-dark"/>
                    </button>
                    <nav className="flex flex-col items-center space-y-6 text-center">
                        {navLinks.map(link => (
                            <a 
                                key={link} 
                                href={`#${link.toLowerCase()}`} 
                                onClick={() => setIsMenuOpen(false)} 
                                className="text-3xl font-bold text-brand-dark hover:text-opacity-70 transition-colors duration-300"
                            >
                                {link}
                            </a>
                        ))}
                    </nav>
                     <div className="md:hidden mt-12 flex flex-col space-y-4 w-48">
                         <Button variant="secondary" className="w-full">Sign In</Button>
                         <Button variant="primary" className="w-full">Sign Up</Button>
                    </div>
                 </div>
            )}
            <style jsx global>{`
              @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              .animate-fade-in {
                animation: fade-in 0.3s ease-in-out;
              }
            `}</style>
        </>
    );
};


// --- SECTION COMPONENTS ---

const HeroSection: React.FC = () => (
    <section>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center min-h-screen pt-24 pb-20">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight max-w-4xl text-brand-dark">
                Next-Generation Digital Experiences
            </h1>
            <p className="mt-6 text-lg text-brand-gray-400 max-w-2xl">
                We build beautiful, functional, and scalable web applications that achieve architectural freedom and drive business growth.
            </p>
            <div className="mt-10">
                <Button withArrow={true} variant="secondary">Start a Project</Button>
            </div>
        </div>
    </section>
);

const ServicesSection: React.FC = () => {
    const services = [
        { icon: <CodeIcon />, title: "Web Development", description: "Crafting high-performance websites and applications with modern, scalable technologies." },
        { icon: <DesignIcon />, title: "UI/UX Design", description: "Designing intuitive and engaging user interfaces that provide a seamless user experience." },
        { icon: <SeoIcon />, title: "SEO & Marketing", description: "Boosting your online presence and driving organic traffic through proven SEO strategies." }
    ];

    return (
        <section id="services" className="py-20 sm:py-28">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark">What We Do</h2>
                    <p className="mt-4 text-brand-gray-400 max-w-2xl mx-auto">From concept to launch, we provide end-to-end solutions to bring your digital vision to life.</p>
                </div>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div key={index} className="bg-neumorphic-background p-8 rounded-2xl shadow-neumorphic-outset text-center">
                            <div className="w-20 h-20 rounded-full bg-neumorphic-background shadow-neumorphic-inset flex items-center justify-center mx-auto mb-6">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold text-brand-dark">{service.title}</h3>
                            <p className="mt-2 text-brand-gray-400 text-sm">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const WorkSection: React.FC = () => {
    const projects = [
        { id: 1, title: 'E-commerce Platform', category: 'Web Development', img: 'https://picsum.photos/seed/project1/600/400' },
        { id: 2, title: 'Mobile Banking App', category: 'UI/UX Design', img: 'https://picsum.photos/seed/project2/600/400' },
        { id: 3, title: 'SaaS Dashboard', category: 'Web Application', img: 'https://picsum.photos/seed/project3/600/400' },
        { id: 4, title: 'Corporate Website', category: 'Web Development', img: 'https://picsum.photos/seed/project4/600/400' },
        { id: 5, title: 'Marketing Campaign', category: 'SEO & Marketing', img: 'https://picsum.photos/seed/project5/600/400' },
        { id: 6, title: 'Branding Redesign', category: 'UI/UX Design', img: 'https://picsum.photos/seed/project6/600/400' },
    ];
    return (
        <section id="work" className="py-20 sm:py-28">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark">Our Work</h2>
                    <p className="mt-4 text-brand-gray-400 max-w-2xl mx-auto">We are proud of the work we do. Check out some of our recent projects.</p>
                </div>
                <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map(project => (
                        <div key={project.id} className="bg-neumorphic-background rounded-2xl shadow-neumorphic-outset p-4 group transition-all duration-300 hover:shadow-neumorphic-inset">
                            <div className="overflow-hidden rounded-xl">
                                <img src={project.img} alt={project.title} className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" />
                            </div>
                            <h3 className="text-lg font-bold text-brand-dark mt-4">{project.title}</h3>
                            <p className="text-sm text-brand-gray-400">{project.category}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const AboutSection: React.FC = () => (
    <section id="about" className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <div className="pr-0 lg:pr-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark">About Our Agency</h2>
                <p className="mt-6 text-brand-gray-400">
                    We are a passionate team of developers, designers, and strategists dedicated to creating innovative digital solutions. We believe in the power of technology to solve problems, connect people, and grow businesses. Our approach is collaborative, transparent, and focused on delivering exceptional results.
                </p>
                <p className="mt-4 text-brand-gray-400">
                    With expertise across various clouds, platforms, and frameworks, we help our clients navigate the complexities of the digital landscape and achieve architectural freedom.
                </p>
                <div className="mt-8">
                    <Button withArrow={true} variant="secondary">Learn More</Button>
                </div>
            </div>
            <div className="p-2 bg-neumorphic-background rounded-2xl shadow-neumorphic-outset">
                <img src="https://picsum.photos/seed/about/800/600" alt="Agency team" className="w-full h-auto object-cover rounded-xl" />
            </div>
        </div>
    </section>
);

const ContactSection: React.FC = () => (
    <section id="contact" className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark">Have a project in mind?</h2>
                <p className="mt-4 text-brand-gray-400">Let's build something amazing together. We're always excited to hear about new ideas.</p>
            </div>
            <form className="mt-16 max-w-xl mx-auto space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div>
                    <input 
                        type="text" 
                        placeholder="Your Name" 
                        aria-label="Your Name"
                        className="w-full bg-neumorphic-background shadow-neumorphic-inset text-brand-dark rounded-full px-6 py-4 placeholder-brand-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-4 focus:ring-offset-neumorphic-background transition-all duration-300 ease-in-out focus:placeholder-brand-gray-400"
                    />
                </div>
                <div>
                    <input 
                        type="email" 
                        placeholder="Your Email"
                        aria-label="Your Email"
                        className="w-full bg-neumorphic-background shadow-neumorphic-inset text-brand-dark rounded-full px-6 py-4 placeholder-brand-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-4 focus:ring-offset-neumorphic-background transition-all duration-300 ease-in-out focus:placeholder-brand-gray-400"
                    />
                </div>
                <div>
                     <textarea 
                        placeholder="Your Message"
                        aria-label="Your Message" 
                        rows={6}
                        className="w-full bg-neumorphic-background shadow-neumorphic-inset text-brand-dark rounded-2xl px-6 py-4 placeholder-brand-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-4 focus:ring-offset-neumorphic-background transition-all duration-300 ease-in-out focus:placeholder-brand-gray-400"
                    />
                </div>
                <div className="text-center">
                    <Button withArrow={true} type="submit" variant="secondary">Send Message</Button>
                </div>
            </form>
        </div>
    </section>
);


const Footer: React.FC = () => (
    <footer className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-brand-gray-400">
            <p>&copy; {new Date().getFullYear()} Agency. All Rights Reserved.</p>
        </div>
    </footer>
);


// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
    return (
        <div className="font-sans">
            <Header />
            <main>
                <HeroSection />
                <ServicesSection />
                <WorkSection />
                <AboutSection />
                <ContactSection />
            </main>
            <Footer />
        </div>
    );
};

export default App;
