import BackButton from "@/components/back-button";
import FormBounty from "@/components/form-bounty";
import PageWrapper from "@/components/page-wrapper";

const CreateBounty = () => {
  return (
    <PageWrapper>
      <div className="p-4">
        <BackButton />
        <div className="text-lg font-semibold mb-4">Create Bounty</div>
        <div className="border rounded-lg p-4">
          <FormBounty />
        </div>
      </div>
    </PageWrapper>
  );
};

export default CreateBounty;
