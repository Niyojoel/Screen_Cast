"use client"

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { TabsType } from '@/app/(root)/profile/[id]/page'

const Tabs = ({tabs, className}: {
    tabs: Array<TabsType>
    className?: string,
}) => {

  const [activeTab, setActiveTab] = useState(tabs[0])
  const [render, setRender] = useState(activeTab.render)

  useEffect(() => {
    setRender(activeTab.render)
    console.log(activeTab)
  }, [activeTab])

  return (
    <section className={cn(`w-full flex flex-col gap-6`, className)}>
        <nav className="tab_nav">
        {tabs.map((t)=> (
            <button 
                key={t.tab}
                className={cn({"text-pink-100": activeTab.tab === t.tab})}
                onClick={()=> setActiveTab(t)}
            >
                {t.tab}
                <hr style={{height: "2px"}} className={cn({"bg-pink-100": activeTab.tab === t.tab})}/>
            </button>
        ))}
        </nav>
        {render}
    </section>
  )
}

export default Tabs