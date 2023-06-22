import chickenShawarma from "../../assets/chicken-shawarma.jpg"
import falafelShawarma from "../../assets/falafel-shawarma.jpg"
import lambShawarma from "../../assets/lamb-shawarma.jpg"
import beefShawarma from "../../assets/beef-shawarma.jpg"

const ShawarmaTypes = () => {
    const shawarmaTypes = [
        {id: 1, name: "Chicken Shawarma", img: chickenShawarma, history: "popular Middle Eastern dish consisting of meat cut into thin slices, stacked in an inverted cone, "},
        {id: 2, name: "Falafel Shawarma", img: falafelShawarma, history: "popular Middle Eastern dish consisting of meat cut into thin slices, stacked in an inverted cone, "},
        {id: 3, name: "Lamb Shawarma", img: lambShawarma, history: "popular Middle Eastern dish consisting of meat cut into thin slices, stacked in an inverted cone, "},
        {id: 4, name: "Beef Shawarma", img: beefShawarma, history: "popular Middle Eastern dish consisting of meat cut into thin slices, stacked in an inverted cone, "},
    ]

    const displayShawarma = shawarmaTypes.map(shawarma => (
        <div className="border-2 border-[#FDDD9D] md:w-[70%]" key={shawarma.id}>
            <div className="p-5 text-center">
                <h3 className="font-bold">{shawarma.name}</h3>
                <p>{shawarma.history}</p>
            </div>
            <div className="base-house">
                <img src={shawarma.img} alt={shawarma.name} className="md:w-[59%] p-3" />
            </div>
        </div>
    ))
  return (
    <div className="container grid grid-cols-4 gap-4 justify-items-end overflow-hidden p-5">
        {displayShawarma}
    </div>
  )
}

export default ShawarmaTypes