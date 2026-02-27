  <script lang="ts">
let button: HTMLAnchorElement;
let text: HTMLSpanElement;
</script>
  
<a bind:this={button}
    class="inline-block bg-[#3d7ccb] text-[#ffcb05] text-2xl font-minecraft rounded-xl p-3 cursor-pointer"
    href="https://unstop.com/hackathons/watch-the-code-2026-graphic-era-hill-university-gehu-haldwani-campus-1644923"
    onmouseenter={()=>{
        gsap.to(button,{
            paddingLeft: 18,
            paddingRight: 18,
            duration: 0.2,
            ease: "power1.inOut",
        })
    }}
    onmouseleave={()=>{
        gsap.to(button,{
            paddingLeft: 12,
            paddingRight: 12,
            duration: 0.2,
            ease: "power1.inOut",
        })
    }}
>
    <span bind:this={text} class="inline-block">
        Register
    </span>
</a>