import { BookOpen, Calculator, Globe, Beaker, Palette, Music } from 'lucide-react';

export const FloatingIcons = () => {
  const icons = [
    { Icon: BookOpen, delay: '0s', position: 'top-20 left-20' },
    { Icon: Calculator, delay: '2s', position: 'top-32 right-24' },
    { Icon: Globe, delay: '4s', position: 'bottom-40 left-16' },
    { Icon: Beaker, delay: '1s', position: 'bottom-20 right-20' },
    { Icon: Palette, delay: '3s', position: 'top-1/2 left-8' },
    { Icon: Music, delay: '5s', position: 'top-1/3 right-12' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {icons.map(({ Icon, delay, position }, index) => (
        <div
          key={index}
          className={`absolute ${position} opacity-10 animate-float`}
          style={{ animationDelay: delay, animationDuration: '6s' }}
        >
          <Icon className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
        </div>
      ))}
    </div>
  );
};