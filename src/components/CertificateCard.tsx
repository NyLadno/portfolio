// Карточка сертификата на компоненте Aceternity «3D Card Effect» (src/components/ui/3d-card.tsx),
// та же композиция, что в scripts/3D Card Effect.txt: слои CardItem на разной глубине translateZ.
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

export type CertificateProps = {
  image: { src: string; srcSet: string; sizes: string; width: number; height: number };
  alt: string;
  kicker: string;
  title: string;
  facts: { label: string; value: string }[];
  pdf: string;
  orientation: "portrait" | "landscape";
};

export default function CertificateCard(props: CertificateProps) {
  const { image, alt, kicker, title, facts, pdf, orientation } = props;
  return (
    <CardContainer intensity={56} containerClassName="cert-scene block py-0" className="cert block w-full">
      <CardBody className={`cert__body cert__body--${orientation} h-auto w-full`}>
        <CardItem translateZ={46} className="cert__media w-full">
          <img
            src={image.src}
            srcSet={image.srcSet}
            sizes={image.sizes}
            width={image.width}
            height={image.height}
            alt={alt}
            loading="lazy"
            decoding="async"
          />
        </CardItem>
        <div className="cert__caption">
          <CardItem translateZ={28} as="p" className="cert__kicker">
            {kicker}
          </CardItem>
          <CardItem translateZ={36} as="h3" className="cert__title">
            {title}
          </CardItem>
          <CardItem translateZ={22} as="dl" className="cert__facts">
            {facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </CardItem>
          <CardItem
            translateZ={30}
            as="a"
            href={pdf}
            target="_blank"
            rel="noopener"
            className="cert__link link-arrow"
          >
            Открыть PDF
            <svg className="arrow" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M3.5 10.5 10.5 3.5M5 3.5h5.5V9" strokeLinecap="square" />
            </svg>
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}
