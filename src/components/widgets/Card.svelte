<script lang="ts">
import { HoverTilt } from "hover-tilt";
</script>

<HoverTilt
  shadow
  scaleFactor={1.1}
  class="[&::part(container)]:rounded-[4.55%/3.5%]"
>
  <slot />
</HoverTilt>