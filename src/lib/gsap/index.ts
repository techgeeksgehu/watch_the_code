import gsap from "gsap";
import { ScrollTrigger, ScrollSmoother, TextPlugin } from "gsap/all";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger, TextPlugin);
gsap.config({ nullTargetWarn: false });

export { gsap, ScrollTrigger, ScrollSmoother, TextPlugin };
