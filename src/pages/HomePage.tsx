import { useEffect } from "react";
import Architecture from "@/components/Architecture";
import Changelog from "@/components/Changelog";
import CodeShowcase from "@/components/CodeShowcase";
import DecoratorsRef from "@/components/DecoratorsRef";
import Features from "@/components/Features";
import Feedback from "@/components/Feedback";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Stats from "@/components/Stats";

export default function HomePage() {
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => {
					if (e.isIntersecting) {
						e.target.classList.add("visible");
						observer.unobserve(e.target);
					}
				});
			},
			{ threshold: 0.1 },
		);
		document.querySelectorAll(".reveal").forEach((el) => {
			observer.observe(el);
		});
		return () => observer.disconnect();
	}, []);

	return (
		<>
			<Navbar />
			<Hero />
			<Stats />
			<div className="divider" />
			<Features />
			<div className="divider" />
			<CodeShowcase />
			<div className="divider" />
			<DecoratorsRef />
			<div className="divider" />
			<Architecture />
			<div className="divider" />
			<Changelog />
			<div className="divider" />
			<Feedback />
			<Footer />
		</>
	);
}
