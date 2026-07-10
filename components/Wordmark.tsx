import Image from "next/image";
import logo from "@/public/voile-noir.png";

type WordmarkProps = {
  className?: string;
  imgClassName?: string;
  priority?: boolean;
};

export default function Wordmark({ className = "", imgClassName = "h-8 w-auto", priority = false }: WordmarkProps) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <Image src={logo} alt="Voile Noir" className={imgClassName} priority={priority} />
    </span>
  );
}
