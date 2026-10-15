import mehndi from "@/assets/celebration-mehndi.jpg";
import haldi from "@/assets/celebration-haldi.jpg";
import sangeet from "@/assets/celebration-sangeet.jpg";
import florals from "@/assets/celebration-florals.jpg";
import firstTouch from "@/assets/ribbon-first-touch.jpg";
import handInHand from "@/assets/ribbon-hand-in-hand.jpg";
import rings from "@/assets/ribbon-rings.jpg";
import bouquet from "@/assets/ribbon-bouquet.jpg";
import goldenBouquet from "@/assets/ribbon-golden-bouquet.jpg";
import table from "@/assets/ribbon-table.jpg";
import quietMoment from "@/assets/ribbon-quiet-moment.jpg";
import veil from "@/assets/ribbon-veil.jpg";
import mistWalk from "@/assets/ribbon-mist-walk.jpg";
import hills from "@/assets/ribbon-hills.jpg";
import sunsetKiss from "@/assets/ribbon-sunset-kiss.jpg";
import beach from "@/assets/ribbon-beach.jpg";

export type PhotoCredit = { author: string; license: string; url: string };
export type Photo = { src: string; alt: string; credit?: PhotoCredit };

// Wikimedia Commons photos. CC BY-SA licences require the visible credit wherever a photo is shown.
const commons = (author: string, license: string, file: string): PhotoCredit => ({
  author,
  license,
  url: `https://commons.wikimedia.org/wiki/File:${file}`,
});

// Unsplash photos need no attribution; the photographer credit is a courtesy.
const unsplash = (author: string, id: string): PhotoCredit => ({
  author,
  license: "Unsplash",
  url: `https://unsplash.com/photos/${id}`,
});

export const photos = {
  mehndi: {
    src: mehndi,
    alt: "An artist drawing an intricate henna pattern on a hand",
    credit: commons("Bandan", "CC BY-SA 3.0", "Mehndi_Macro.jpg"),
  },
  haldi: {
    src: haldi,
    alt: "Family showering a bride and groom with marigold petals under a yellow haldi canopy",
    credit: unsplash("Rohit Sharma", "DlVEPWJIhvQ"),
  },
  sangeet: {
    src: sangeet,
    alt: "A crowd making heart shapes with their hands under warm stage lights",
    credit: unsplash("Anthony Delanoix", "hzgs56Ze49s"),
  },
  florals: {
    src: florals,
    alt: "A garden wedding arch with yellow drapes surrounded by marigolds and flowers",
    credit: commons("Megh Banthia", "CC BY-SA 4.0", "Sustainable_flower_decoration.jpg"),
  },
  firstTouch: {
    src: firstTouch,
    alt: "A bride in a lace sleeve reaching for the groom's hand, their shadows on the grass",
    credit: unsplash("Jeremy Wong Weddings", "464ps_nOflw"),
  },
  handInHand: {
    src: handInHand,
    alt: "A bride and groom standing close with their hands clasped",
    credit: unsplash("Nathan Dumlao", "rGHO4XSF0Qk"),
  },
  rings: {
    src: rings,
    alt: "A bride and groom's hands showing their wedding rings beside an orange bouquet",
    credit: unsplash("Samantha Gades", "odt2t81dZtQ"),
  },
  bouquet: {
    src: bouquet,
    alt: "A bride holding a dried-flower bouquet beside the groom",
    credit: unsplash("Hannah Busing", "6NUUZZ16hJk"),
  },
  goldenBouquet: {
    src: goldenBouquet,
    alt: "A bridal bouquet of white and coral flowers glowing in warm evening light",
    credit: unsplash("Nathan Dumlao", "5BB_atDT4oA"),
  },
  table: {
    src: table,
    alt: "A long wedding dinner table with white linen, glassware and floral centrepieces",
    credit: unsplash("Cody Chan", "7jgtAhJkjwk"),
  },
  quietMoment: {
    src: quietMoment,
    alt: "A bride and groom sitting together on a wooden bench, her bouquet in her lap",
    credit: unsplash("Nathan Dumlao", "duNBz_LBaEc"),
  },
  veil: {
    src: veil,
    alt: "A bride and groom resting their foreheads together beneath her veil",
    credit: unsplash("Nathan Dumlao", "BOhDR9n4u2s"),
  },
  mistWalk: {
    src: mistWalk,
    alt: "A couple walking hand in hand through a misty, sunlit meadow",
    credit: unsplash("Dat Nguyen", "yJtrQ7v95ws"),
  },
  hills: {
    src: hills,
    alt: "A bride and groom walking together across open hills",
    credit: unsplash("Foto Pettine", "IfjHaIoAoqE"),
  },
  sunsetKiss: {
    src: sunsetKiss,
    alt: "A couple embracing in a field as the sun sets behind them",
    credit: unsplash("Anna Vi", "QUi84upBhoc"),
  },
  beach: {
    src: beach,
    alt: "A couple embracing at the water's edge on a beach at sunset",
    credit: unsplash("Nathan Dumlao", "w5hhoYM_JsU"),
  },
} satisfies Record<string, Photo>;
