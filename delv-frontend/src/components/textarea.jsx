import React from "react";

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
   <textarea
      className={`
      <textarea
       "absolute w-full h-full bg-inherit m-0 p-0 border-none resize-none text-gray-800 font-sans text-base
  relative w-[300px] h-[125px] p-2.5 rounded-[5px] border border-lightBlue-300 bg-lightBlue-200 before:content-[''] before:absolute before:right-full before:top-[26px] before:w-0 before:h-0 before:border-t-[13px] before:border-t-transparent before:border-r-[26px] before:border-r-lightBlue-200 before:border-b-[13px] before:border-b-transparent
  "
        ${className}
      `}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };