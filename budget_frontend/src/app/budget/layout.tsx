"use client";
import SideNav from '@/components/layout/SideNav';

export default function BudgetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SideNav>{children}</SideNav>;
}