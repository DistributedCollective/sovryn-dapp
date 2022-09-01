import React, { ComponentProps, useCallback, useState } from "react";
import { Story } from "@storybook/react";

import { Overlay } from "./Overlay";
import { Button } from "../../1_atoms";

export default {
  title: "Molecule/Overlay",
  component: Overlay,
};

const Template: Story<ComponentProps<typeof Overlay>> = (args) => (
  <Overlay {...args} />
);

const InteractiveTemplate: Story<ComponentProps<typeof Overlay>> = (args) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = useCallback(() => setOpen((open) => !open), []);

  return (
    <div className="relative mx-auto w-80 h-80 p-8 bg-gray-3 text-center">
      <Button onClick={toggleOpen} label="open" />
      <Overlay {...args} isOpen={open} onBlur={toggleOpen} />
    </div>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  portalTarget: "body",
  children: "Overlay Active",
  fixed: true,
};

export const Interactive = InteractiveTemplate.bind({});
Interactive.args = {
  portalTarget: "body",
  children: "Overlay Active",
};
