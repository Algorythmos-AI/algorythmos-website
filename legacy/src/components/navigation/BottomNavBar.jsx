import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Grid, Mail, MoreHorizontal, DollarSign } from "lucide-react"; // Icons for bottom nav
import { useI18n } from "../../app/i18n/I18nContext";
import { getNavItems } from "../../app/i18n/navConfig";

export default function BottomNavBar({ onOpenMenu }) {
    const { region, t } = useI18n();
    const navItems = getNavItems(region);

    // We want specific core items: Home, Services, Pricing, Contact
    // Filter/Find them safely
    const findItem = (key) => navItems.find((i) => i.key === key);

    const homeItem = findItem("nav.home");
    const servicesItem = findItem("nav.services");
    const pricingItem = findItem("nav.pricing");
    const contactItem = findItem("nav.contact");

    const bottomLinks = [
        { item: homeItem, icon: Home, label: "Home" },
        { item: servicesItem, icon: Grid, label: "Services" },
        { item: pricingItem, icon: DollarSign, label: "Pricing" },
        { item: contactItem, icon: Mail, label: "Contact" },
    ];

    return (
        <div className="fixed bottom-0 left-0 w-full z-40 bg-black/80 backdrop-blur-xl border-t border-white/10 lg:hidden pb-safe">
            <div className="flex items-center justify-around h-16 px-2">
                {bottomLinks.map(({ item, icon: IconComponent }) => {
                    if (!item) return null;
                    return (
                        <NavLink
                            key={item.key}
                            to={item.path}
                            end={item.path === "/" || item.path === "/fr" || item.path === "/au"} // strict match for home
                            className={({ isActive }) =>
                                `flex flex-col items-center justify-center w-full h-full gap-1 transition-colors duration-200
                 ${isActive ? "text-violet-400" : "text-gray-400 hover:text-gray-200"}`
                            }
                        >
                            <IconComponent className="w-5 h-5" strokeWidth={2} />
                            <span className="text-[10px] font-medium">{t(item.key).split(" ")[0]}</span>
                        </NavLink>
                    );
                })}

                {/* More Button to trigger full menu */}
                <button
                    onClick={onOpenMenu}
                    className="flex flex-col items-center justify-center w-full h-full gap-1 text-gray-400 hover:text-gray-200 transition-colors duration-200"
                    aria-label="Menu"
                >
                    <MoreHorizontal className="w-5 h-5" strokeWidth={2} />
                    <span className="text-[10px] font-medium">More</span>
                </button>
            </div>
        </div>
    );
}
