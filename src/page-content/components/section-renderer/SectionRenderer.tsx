import React from "react";
import { ReactNode } from "react";
import Section from "@/components/section/Section";

export type SectionKind = "content" | "cta";

export type SectionItem = {
  key: string;
  kind: SectionKind;
  render: ReactNode;
  enabled?: boolean;
  sectionId?: string;
  useHeaderImage?: boolean;
  headerHeight?: string;
};

/*
 * Sections are separated by their own vertical rhythm and nothing else.
 *
 * ui-001 pushed a 180px full-bleed band of the banner photograph between every pair of
 * sections (SolidDivider). The Figma has no such band: sections stack on the page
 * background, and the spacing comes from the section padding. The band also had a fixed
 * background attachment, which parallaxed on desktop and juddered on iOS.
 *
 * The section list and its enablement conditions are untouched — only the separator is gone,
 * so `disableTopDivider` / `disableBottomDivider` no longer have anything to switch off.
 */
export function renderSectionsWithDividers(sections: SectionItem[]) {
  const visibleSections = sections.filter((s) => s.enabled !== false);

  return visibleSections.map((section) => (
    <React.Fragment key={section.key}>
      {section.kind === "content" ? (
        <Section
          id={section.sectionId}
          useHeaderImage={section.useHeaderImage}
          headerHeight={section.headerHeight}
        >
          {section.render}
        </Section>
      ) : (
        section.render
      )}
    </React.Fragment>
  ));
}
