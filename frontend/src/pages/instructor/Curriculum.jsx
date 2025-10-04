import Section from "../../components/instructor/curriculum/Section";

const sections = [
    {
        id: "1",
        title: "Giới thiệu",
        order: 1,
    },
];
const Curriculum = () => {
    return (
        <div>
            <div className="fixed w-full h-[50px] top-0 left-0"></div>
            <div>
                <h3 className="text-lg p-5 border-b border-b-grayText/20">Chường trình học</h3>
                <div className="p-5 flex flex-col gap-5">
                    {sections.map((section, index) => (
                        <Section index={index} section={section}></Section>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Curriculum;
