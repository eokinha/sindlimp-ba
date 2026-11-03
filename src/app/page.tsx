import Image from "next/image";
import Link from "next/link";
import HeroSlider, { type Slide } from "@/components/HeroSlider";
import Icon, { type IconName } from "@/components/Icon";
import { Carousel, Reveal, Roller, Tilt } from "@/components/Motion";
import PostCard from "@/components/PostCard";
import PostThumb from "@/components/PostThumb";
import { PHONE } from "@/components/site";
import { getPosts } from "@/lib/content";

// As fotos originais do slider (FOTO-*.jpg) não estão no espelho; usamos fotos já baixadas.
const SLIDES: Slide[] = [
  {
    image: "/wp-content/uploads/2023/05/IMG_20230516_102322235-scaled-min-e1684263449923.jpg",
    title: "TRABALHADOR FORTE",
    highlight: "É TRABALHADOR SINDICALIZADO",
    text: "Filie-se ao SINDILIMP!",
    align: "left",
  },
  {
    image: "/wp-content/uploads/2023/05/Lsuica.jpg",
    title: "Sindilimp na luta por você",
    highlight: "Na luta com você",
    text: "Assistência aos trabalhadores e trabalhadoras da limpeza pública e terceirizados",
    align: "center",
  },
  {
    image: "/wp-content/uploads/2023/05/mulher_diadamulher-scaled.jpg",
    title: "Por garantia de direitos",
    highlight: "Por representatividade",
    text: "Categoria unida para conquistar e avançar",
    align: "left",
  },
];

const IMG = "/wp-content/themes/gradiant/templates/meu-img/";
const SERVICES = [
  { name: "Psicologia", img: "psicologia.png" },
  { name: "Barbearia", img: "barbearia-removebg-preview.png" },
  { name: "Assistência Previdênciária", img: "previdencia.png" },
  { name: "Exames laboratoriais", img: "transferir-removebg-preview.png" },
];

const FEATURES: { icon: IconName; title: string; text: string }[] = [
  { icon: "users", title: "Filiados", text: "Trabalhadores e trabalhadoras filiados em todo território baiano." },
  { icon: "marker", title: "Abrangência", text: "Sedes em mais de 20 municípios da Bahia" },
  { icon: "chart", title: "Atendimento", text: "Mais de 300 atendimentos ao trabalhador e trabalhadora por mês" },
];

export default async function Home() {
  const { items } = await getPosts({ perPage: 6 });
  const highlights = items.slice(0, 3);
  const latest = items.slice(3, 6);

  return (
    <>
      <HeroSlider slides={SLIDES} />

      <section className="cta-section">
        <div className="container cta-section__inner">
          <div className="call-wrapper">
            <span className="call-icon-box">
              <Icon name="user" size={26} />
            </span>
            <div>
              <div className="call-title">Fale com a gente</div>
              <div className="call-phone">{PHONE}</div>
            </div>
          </div>
          <div className="cta-content">
            <span className="cta-icon-wrap">
              <Icon name="phone" size={22} />
            </span>
            <div>
              <h4>Mantenha-se em contato com o seu sindicato.</h4>
              <p>Acesse nossas redes sociais ou fale conosco pelo telefone.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section portfolio-section">
        <Reveal animation="fadeInUp" className="container grid-3">
          {highlights.map((post) => (
            <figure key={post.slug} className="portfolio-item">
              <Link href={`/${post.slug}`} className="portfolio-thumb" aria-hidden="true" tabIndex={-1}>
                <PostThumb src={post.image} alt="" sizes="(max-width: 768px) 100vw, 400px" />
              </Link>
              <figcaption className="portfolio-caption">
                <Link href={`/${post.slug}`}>
                  <h6>{post.title}</h6>
                </Link>
                <p>{post.excerpt}</p>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </section>

      <section className="section post-section post-section--home">
        <div className="container">
          <Carousel className="post-carousel" nav>
            {latest.map((post, i) => (
              <PostCard key={post.slug} post={post} count={i + 1} />
            ))}
          </Carousel>
        </div>
      </section>

      <Roller className="section client-section">
        <div className="container">
          <Reveal animation="fadeInUp">
            <h3 className="section-heading">
              <span className="primary-color">ASLIMP</span>
            </h3>
          </Reveal>
          <Carousel className="partner-carousel">
            {SERVICES.map((s) => (
              <div key={s.name} className="single-partner">
                <Image src={IMG + s.img} alt="" width={255} height={255} />
                <strong className="client-name">{s.name}</strong>
              </div>
            ))}
          </Carousel>
          <p className="celularapenas">Deslize para o lado</p>
        </div>
      </Roller>

      <section className="section features-section">
        <Reveal animation="fadeInUp" className="container grid-3">
          {FEATURES.map((f) => (
            <Tilt key={f.title}>
              <div className="features-item">
              <span className="features-icon">
                <Icon name={f.icon} size={34} />
              </span>
              <h6 className="features-title">{f.title}</h6>
              <p>{f.text}</p>
            </div>
            </Tilt>
          ))}
        </Reveal>
      </section>
    </>
  );
}
