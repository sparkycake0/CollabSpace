"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface SliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  color?: string; // Controls both thumb and filled color
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  color = "#ffffff", // default white
  ...props
}: SliderProps) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none select-none items-center data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    >
      {/* Track */}
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "relative grow overflow-hidden rounded-full bg-neutral-800 data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
        )}
      >
        {/* Filled part */}
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          style={{ backgroundColor: color }}
        />
      </SliderPrimitive.Track>

      {/* Thumb(s) */}
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="block size-4 shrink-0 rounded-full shadow-md transition-all hover:scale-105 focus-visible:scale-110 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          style={{ backgroundColor: color }}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
