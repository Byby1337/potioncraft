import axios from "axios";
import FormData from "form-data";


const PINATA_KEY = process.env.PINATA_API_KEY!;
const PINATA_SECRET = process.env.PINATA_API_SECRET!;

if (!PINATA_KEY || !PINATA_SECRET) throw new Error("Pinata keys are not set");

// ======================
// Upload local file
// ======================
export async function uploadFileToIPFS(buffer: Buffer, filename: string) {
  const form = new FormData();
  form.append("file", buffer, { filename });

  const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", form, {
    maxBodyLength: Infinity,
    headers: {
      pinata_api_key: PINATA_KEY,
      pinata_secret_api_key: PINATA_SECRET,
      ...form.getHeaders(),
    },
  });

  return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
}

// ======================
// Upload JSON
// ======================
export async function uploadJSONToIPFS(json: any) {
  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    json,
    {
      headers: {
        pinata_api_key: PINATA_KEY,
        pinata_secret_api_key: PINATA_SECRET,
      },
    }
  );

  return `ipfs://${res.data.IpfsHash}`;
}
