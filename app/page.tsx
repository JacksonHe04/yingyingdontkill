'use client';

import { getReadmeData } from '@/lib/utils';
import TopNav from '@/components/TopNav';
import SideNav from '@/components/SideNav';
import BasicSection from '@/components/sections/BasicSection';
import LifeSection from '@/components/sections/LifeSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import EducationSection from '@/components/sections/EducationSection';
import WorkSection from '@/components/sections/WorkSection';
import DevelopmentSection from '@/components/sections/DevelopmentSection';
import ProductsSection from '@/components/sections/ProductsSection';
import ReadingSection from '@/components/sections/ReadingSection';
import FilmsSection from '@/components/sections/FilmsSection';
import CreationSection from '@/components/sections/CreationSection';
import MusicSection from '@/components/sections/MusicSection';
import HiphopSection from '@/components/sections/HiphopSection';
import EventsSection from '@/components/sections/EventsSection';
import TagsSection from '@/components/sections/TagsSection';
import ContactSection from '@/components/sections/ContactSection';
import MessageSection from '@/components/sections/MessageSection';
import FooterSection from '@/components/sections/FooterSection';
import DeepWaterSection from '@/components/sections/DeepWaterSection';

export default function Home() {
  const data = getReadmeData();

  return (
    <main className="relative min-h-screen">
      <TopNav data={data} />
      <SideNav />
      
      <div className="pt-16 lg:pl-32 xl:pl-40 2xl:pl-48 transition-all duration-300">
        <BasicSection data={data.basic} />
        <LifeSection data={data.life} />
        <ExperienceSection data={data.experience} />
        <EducationSection data={data.education} />
        <WorkSection data={data.work} />
        <DevelopmentSection data={data.development} />
        <ProductsSection data={data.products} />
        <ReadingSection data={data.reading} />
        <FilmsSection data={data.films} />
        <CreationSection data={data.creation} />
        <MusicSection data={data.music} />
        <HiphopSection data={data.hiphop} />
        <EventsSection data={data.events} />
        <TagsSection data={data} />
        <ContactSection data={data.contact} />
        <MessageSection />
        <FooterSection />
        <DeepWaterSection data={data.thoughts} />
      </div>
    </main>
  );
}
