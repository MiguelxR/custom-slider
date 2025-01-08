import {render, screen} from "@testing-library/react";
import Home from "@/app/page";

it("render home page", () => {
    render(<Home/>)

    expect(screen.getByText('Learn')).toBeInTheDocument()
})