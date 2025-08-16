import TransitionLink from "@/components/common/TransitionLink";

export default function AboutPage() {
  return (
    <TransitionLink
      href="/"
      className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
    >
      홈으로 돌아가기
    </TransitionLink>
  );
}
