import Link from 'next/link';
import NavigationItem from './NavigationItem';

export default function Navigation() {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <NavigationItem href="/">Home</NavigationItem>
        <NavigationItem href="/products">Products</NavigationItem>
        {/* Add more */}
      </ul>
    </nav>
  );
}