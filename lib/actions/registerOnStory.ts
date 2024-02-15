'use server';
import { supabaseClient } from "../supabase/supabaseClient";

export async function registerOnStory(farcasterName: string, castName: string, castPrompt: string | null, castId: number, imageUrl: string) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "registrarId": farcasterName,
        "artworkName": `Artcast ${castId}: ${castName}`,
        "description": castPrompt ? castPrompt : 'A new Artcast.',
        "authors": [
            {
                "name": farcasterName,
                "percentage": 100
            }
        ],
        "licenseParam": {
            "isCommercial": true
        },
        "mediaUrl": imageUrl,
        "origin": "Artcast",
        "originUrl": `artcast.ai/cast/${castId}`,
        "tags": [
            {
                "key": "AI Assisted",
                "value": "True"
            }
        ]
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw
    };

    console.log('registering on sp alpha...')

    const response = await fetch("https://magma.demo.storyprotocol.net/registration/artwork", requestOptions);
    const result = await response.json();
    const story_explorer_url = result.storyExplorerUrl
    const { data, error } = await supabaseClient.from('cast_datas').update({
        story_explorer_url
    }).eq('id', castId);
};