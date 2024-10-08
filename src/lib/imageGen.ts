import { 
  GenerationInputStable
   } from "../types/stable_horde";

import config from "../../config.json"
import axiosInstance from "./axios";

const models = [
    "Openniji", "Inkpunk Diffusion", "Midjourney PaintArt",
    "OpenJourney Diffusion", "iCoMix Inpainting", "Deliberate", "Deliberate 3.0"] as const;
const samplers = [
    "k_lms", "k_heun", "k_euler", "k_euler_a",
    "k_dpm_2", "k_dpm_2_a", "k_dpm_fast",
    "k_dpm_adaptive", "k_dpmpp_2s_a",
    "k_dpmpp_2m", "dpmsolver", "k_dpmpp_sde", "DDIM"] as const;

    type ModelName = typeof models[number];
    type SamplerName = typeof samplers[number];
    
// generate an image
async function generateImage(
    prompt: string, // prompt to use
    model:ModelName = models[5], // model to use
    apiKey: string, // api key to use
    height:number = 512, // height of the image
    width:number = 512, // width of the image
    n:number = 1, // number of images to generate
    steps?:number, // number of steps to generate
    sampler?:SamplerName, // sampler to use
    cfg_scale?: number, // scale to use
    seed?: number, // seed to use
    ) {
    try {
        const payload: GenerationInputStable = {
        prompt: prompt,
        params: {
            steps,
            n,
            sampler_name: sampler,
            cfg_scale,
            seed: seed?.toString(),
            height,
            width,
            karras: true,
            clip_skip: 1,
            },
        nsfw: true,
        models: [model]
      };
      const result = await axiosInstance.post('/generate/async', payload, { headers: { 'apikey': apiKey } });
      console.log("Generated Image:", result);
      return {id: result.data.id, image: result.data.message};
    }
    catch (error) {
      console.error("An error occurred while generating image:", error);
      return undefined;
    }
  }

async function checkGenerationImageStatus(image_id: string) {
    try {
        const checkImage = await axiosInstance.get(`/generate/check/${image_id}`);
        console.log("Image Generation Check:", checkImage.data);
        return checkImage.data;
    }
    catch (error) {
        console.error("An error occurred while getting generated image:", error);
        return undefined;
    }
}

async function getGeneratedImage(image_id: string) {
    try {
        const result = await axiosInstance.get(`/generate/status/${image_id}`);
        console.log("Image Generation Status:", result.data);
        return result.data;
    }
    catch (error) {
        console.error("An error occurred while checking image generation status:", error);
        return undefined;
    }
}

async function generateAndRetrieveImage(
    prompt: string,
    model: ModelName,
    apiKey: string,
    height: number,
    width: number,
    n: number,
    steps?: number,
    sampler?: SamplerName,
    cfg_scale?: number,
    seed?: number
  ): Promise<any> {
    // Step 1: Initiate image generation
    const generateResult = await generateImage(
      prompt,
      model,
      apiKey,
      height,
      width,
      n,
      steps,
      sampler,
      cfg_scale,
      seed
    );
  
    if (!generateResult || !generateResult.id) {
      throw new Error("Failed to initiate image generation.");
    }
  
    const image_id = generateResult.id;
  
    // Step 2: Poll for image generation status
    const maxTime = 3 * 60 * 1000; // 3 minutes in milliseconds
    const startTime = Date.now();
  
    while (true) {
      const status = await checkGenerationImageStatus(image_id);
  
      if (!status) {
        throw new Error("Failed to get image generation status.");
      }
  
      if (status.done) {
        // Image generation is complete
        break;
      }
  
      if (status.faulted) {
        throw new Error("Image generation faulted.");
      }
  
      // Check if the maximum wait time has been exceeded
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime >= maxTime) {
        throw new Error("Image generation timed out after 3 minutes.");
      }
  
      // Wait for 5 seconds before checking again
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  
    // Step 3: Retrieve the generated image
    const imageData = await getGeneratedImage(image_id);
  
    if (!imageData) {
      throw new Error("Failed to retrieve generated image.");
    }
  
    // Step 4: Return the image data
    return imageData;
  }
  
  // Usage example
  const apiKey = config.mainUserKey;
  
  generateAndRetrieveImage(
    "Extremely detailed photographic image, grained image, beautifully composed, monochrome image, 00's fashionable image, fashionable magazine photography, leica summicron 35mm f2.0, Kodak 400tx, fashion photography, fashionable model, Two beautiful Japanese realistic anime idol girls, one white dress, one black suit with mini skirt, turning their backs on each other with no intimacy",
    models[1],
    apiKey,
    512,
    512,
    1,
    30,
    "k_dpmpp_2m",
    undefined,
    undefined
  )
    .then((data) => {
      console.log("Generated Image Data:", data);
      // Process or display the image data as needed
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });