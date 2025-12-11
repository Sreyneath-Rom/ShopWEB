import Link from 'next/link';

interface NavigationItemProps {
  href: string;
  children: React.ReactNode;
}

export default function NavigationItem({ href, children }: NavigationItemProps) {
  return (
    <li>
      <Link href={href} className="text-white hover:underline">
        {children}
      </Link>
    </li>
  );
}