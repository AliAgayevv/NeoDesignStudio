"use client";
import { useGetAllWorksQuery } from "@/store/services/workApi";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectLanguage } from "@/store/services/languageSlice";

const Page = () => {
  const { data, error, isLoading } = useGetAllWorksQuery();
  const lang = useSelector(selectLanguage);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading portfolio.</p>;

  console.log(data?.map((work) => work.description[lang]));
  console.log(lang);

  return (
    <div className="pt-40 text-5xl text-black">
      {data?.map((work) => (
        <div key={work.projectId}>
          {/* <h3>{work.content.en}</h3> */}
          <Image src={`${work.images[0]}`} width={400} height={400} alt="" />

          {/* {work.images.map((image, index) => (
            <Image
              key={index}
              src={`https://localhost:4000${image}`}
              alt={`Project image ${index + 1}`}
              className="w-1/2 h-full"
              width={400}
              height={400}
            />
          ))} */}
        </div>
      ))}
    </div>
  );
};

export default Page;
