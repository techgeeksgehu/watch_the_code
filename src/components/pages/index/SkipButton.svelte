<script lang="ts">
let btn: HTMLButtonElement;
let icon: HTMLSpanElement;
let text: HTMLSpanElement;
</script>

<button
    bind:this={btn}
    id="skip-button"
    class="bg-white text-gray-800 font-minecraft px-3 py-1 rounded-md text-sm md:text-lg z-10 cursor-pointer"
    onclick={()=>{
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
        });
    }}
    onmouseenter={()=>{
        gsap.to(text, {
            x: -6,
            duration: 0.2,
            ease: "power1.inOut",
        });
        gsap.to(btn, {
            paddingLeft: 18, // 12 + 6 = 18px
            duration: 0.2,
            ease: "power1.inOut",
        });
    }}
    onmouseleave={()=>{
        gsap.to(text, {
            x: 0,
            duration: 0.2,
            ease: "power1.inOut",
        });
        gsap.to(btn, {
            paddingLeft: 12, // back to px-3 (12px)
            duration: 0.2,
            ease: "power1.inOut",
        });
    }}
>
    <span class="mr-1 inline-block" bind:this={text}>Skip</span>
    <span bind:this={icon} class="inline-block">&gt;</span>
</button>
