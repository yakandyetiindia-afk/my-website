export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return Response.json(
      {
        configured: false,
        reviews: [],
        message: "Google reviews are not configured. Set GOOGLE_MAPS_API_KEY and GOOGLE_PLACE_ID."
      },
      { status: 200 }
    );
  }

  const newPlacesUrl = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`;
  const newPlacesResponse = await fetch(newPlacesUrl, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "displayName,rating,userRatingCount,reviews,googleMapsUri"
    },
    next: { revalidate: 3600 }
  });
  const newPlacesData = await newPlacesResponse.json();

  if (newPlacesResponse.ok && !newPlacesData.error) {
    const reviews = (newPlacesData.reviews || []).map((review) => ({
      name: review.authorAttribution?.displayName || "Google reviewer",
      rating: String(review.rating || ""),
      text: review.text?.text || review.originalText?.text || "",
      relativeTime: review.relativePublishTimeDescription || "",
      profilePhoto: review.authorAttribution?.photoUri || "",
      url: review.authorAttribution?.uri || newPlacesData.googleMapsUri || ""
    })).filter((review) => review.text);

    return Response.json({
      configured: true,
      placeUrl: newPlacesData.googleMapsUri,
      rating: newPlacesData.rating,
      total: newPlacesData.userRatingCount,
      reviews
    });
  }

  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "name,rating,user_ratings_total,reviews,url");
  url.searchParams.set("reviews_sort", "newest");
  url.searchParams.set("key", apiKey);

  const response = await fetch(url, { next: { revalidate: 3600 } });
  const data = await response.json();

  if (!response.ok || data.status !== "OK") {
    return Response.json(
      {
        configured: true,
        reviews: [],
        message: newPlacesData.error?.message || data.error_message || data.status || "Unable to load Google reviews."
      },
      { status: 502 }
    );
  }

  const reviews = (data.result.reviews || []).map((review) => ({
    name: review.author_name,
    rating: String(review.rating),
    text: review.text,
    relativeTime: review.relative_time_description,
    profilePhoto: review.profile_photo_url,
    url: review.author_url
  }));

  return Response.json({
    configured: true,
    placeUrl: data.result.url,
    rating: data.result.rating,
    total: data.result.user_ratings_total,
    reviews
  });
}
