<script lang="ts">
let btn: HTMLButtonElement;
let icon: HTMLSpanElement;
let text: HTMLSpanElement;
</script>

<button
    bind:this={btn}
    id="top-button"
    class="bg-white text-gray-800 font-minecraft px-3 py-1 rounded-md text-sm md:text-lg z-10 cursor-pointer opacity-0"
    onclick={()=>{
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }}
    onmouseenter={()=>{
        gsap.to(icon, {
            y: -3,
            duration: 0.2,
            ease: "power1.inOut",
        });
         gsap.to(text, {
            x: 6,
            duration: 0.2,
            ease: "power1.inOut",
        });
        gsap.to(btn, {
            paddingRight: 18, // 12 + 6 = 18px
            duration: 0.2,
            ease: "power1.inOut",
        });
    }}
    onmouseleave={()=>{
        gsap.to(icon, {
            y: 0,
            duration: 0.2,
            ease: "power1.inOut",
        });
        gsap.to(text, {
            x: 0,
            duration: 0.2,
            ease: "power1.inOut",
        });
        gsap.to(btn, {
            paddingRight: 12, // back to px-3 (12px)
            duration: 0.2,
            ease: "power1.inOut",
        });
    }}
>
    <span bind:this={icon} class="inline-block">^</span>
    <span bind:this={text} class="ml-1 inline-block">Top</span>
    
</button>
