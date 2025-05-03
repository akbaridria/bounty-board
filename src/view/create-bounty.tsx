import BackButton from "@/components/back-button";
import FormBounty from "@/components/form-bounty";
import PageWrapper from "@/components/page-wrapper";

interface CreateBountyProps {
  mode?: "create" | "edit";
}
const CreateBounty: React.FC<CreateBountyProps> = ({ mode = 'create' }) => {
  return (
    <PageWrapper>
      <div className="p-4">
        <BackButton />
        <div className="text-lg font-semibold mb-4">Create Bounty</div>
        <div className="border rounded-lg">
          <FormBounty mode={mode} />
        </div>
      </div>
    </PageWrapper>
  );
};

export default CreateBounty;
