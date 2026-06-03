'use client';

type HeadingProps = {
    title: string;
    subTitle?: string;
}

const PageHeading = ({ title, subTitle }: HeadingProps) => {
    return (
        <div className="flex items-center justify-center text-center flex-col gap-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-brand">{title}</h1>
            {subTitle && <p className="opacity-70">{subTitle}</p> || <></>}
        </div>
    )
}

export default PageHeading;